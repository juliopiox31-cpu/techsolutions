<?php

use App\Models\Cliente;
use App\Models\Mensaje;
use App\Models\Permission;
use App\Models\Proyecto;
use App\Models\Role;
use App\Models\Tarea;
use App\Models\User;
use App\Support\GuatemalaTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        if (auth()->user()->role === 'Cliente') {
            return inertia('cliente-dashboard');
        }

        return inertia('dashboard');
    })->name('dashboard');

    Route::get('/clientes/{cliente}', function (Cliente $cliente) {
        if (auth()->user()->role === 'Cliente') {
            abort(403);
        }
        $cliente->loadMissing(['createdBy', 'updatedBy']);

        return inertia('clientes/show', [
            'cliente' => [
                'id' => $cliente->id,
                'name' => $cliente->name,
                'email' => $cliente->email,
                'phone' => $cliente->phone,
                'company' => $cliente->company,
                'status' => $cliente->status,
                'created_at' => GuatemalaTime::formatDateTime($cliente->created_at),
                'updated_at' => GuatemalaTime::formatDateTime($cliente->updated_at),
                'created_by' => $cliente->createdBy ? ['id' => $cliente->createdBy->id, 'name' => $cliente->createdBy->name] : null,
                'updated_by' => $cliente->updatedBy ? ['id' => $cliente->updatedBy->id, 'name' => $cliente->updatedBy->name] : null,
            ],
        ]);
    })->name('clientes.show');

    Route::get('/proyectos/{proyecto}', function (Proyecto $proyecto) {
        if (auth()->user()->role === 'Cliente') {
            abort(403);
        }
        $proyecto->loadMissing(['cliente', 'createdBy', 'updatedBy']);

        return inertia('proyectos/show', [
            'proyecto' => [
                'id' => $proyecto->id,
                'name' => $proyecto->name,
                'description' => $proyecto->description,
                'status' => $proyecto->status,
                'cliente' => $proyecto->cliente ? ['id' => $proyecto->cliente->id, 'name' => $proyecto->cliente->name] : null,
                'created_at' => GuatemalaTime::formatDateTime($proyecto->created_at),
                'updated_at' => GuatemalaTime::formatDateTime($proyecto->updated_at),
                'created_by' => $proyecto->createdBy ? ['id' => $proyecto->createdBy->id, 'name' => $proyecto->createdBy->name] : null,
                'updated_by' => $proyecto->updatedBy ? ['id' => $proyecto->updatedBy->id, 'name' => $proyecto->updatedBy->name] : null,
            ],
        ]);
    })->name('proyectos.show');

    Route::get('/tareas/{tarea}', function (Tarea $tarea) {
        if (auth()->user()->role === 'Cliente') {
            abort(403);
        }
        $tarea->loadMissing(['proyecto', 'user', 'createdBy', 'updatedBy']);

        return inertia('tareas/show', [
            'tarea' => [
                'id' => $tarea->id,
                'title' => $tarea->title,
                'description' => $tarea->description,
                'status' => $tarea->status,
                'proyecto' => $tarea->proyecto ? ['id' => $tarea->proyecto->id, 'name' => $tarea->proyecto->name] : null,
                'assignee' => $tarea->user ? ['id' => $tarea->user->id, 'name' => $tarea->user->name] : null,
                'created_at' => GuatemalaTime::formatDateTime($tarea->created_at),
                'updated_at' => GuatemalaTime::formatDateTime($tarea->updated_at),
                'created_by' => $tarea->createdBy ? ['id' => $tarea->createdBy->id, 'name' => $tarea->createdBy->name] : null,
                'updated_by' => $tarea->updatedBy ? ['id' => $tarea->updatedBy->id, 'name' => $tarea->updatedBy->name] : null,
            ],
        ]);
    })->name('tareas.show');

    Route::inertia('clientes', 'clientes')->name('clientes');
    Route::inertia('usuarios', 'usuarios')->name('usuarios');
    Route::inertia('roles', 'roles')->name('roles');
    Route::inertia('reportes', 'reportes')->name('reportes');
    Route::inertia('proyectos', 'proyectos')->name('proyectos');
    Route::inertia('tareas', 'tareas')->name('tareas');
    Route::inertia('mensajes', 'mensajes')->name('mensajes');
    Route::inertia('actividad', 'actividad')->name('actividad');
    Route::inertia('asignaciones', 'asignaciones')->name('asignaciones');

    Route::get('/api/asignaciones', function () {
        $trabajadores = User::where('role', 'Trabajador')
            ->with(['tareasAsignadas.proyecto'])
            ->get()
            ->map(function ($trabajador) {
                // Get unique projects from tasks
                $proyectos = $trabajador->tareasAsignadas->map(function ($t) {
                    return $t->proyecto;
                })->filter()->unique('id')->values();

                return [
                    'id' => $trabajador->id,
                    'name' => $trabajador->name,
                    'email' => $trabajador->email,
                    'phone' => $trabajador->phone,
                    'proyectos_asignados' => $proyectos,
                    'total_tareas' => $trabajador->tareasAsignadas->count(),
                ];
            });

        return response()->json($trabajadores);
    });

    // API for Client Dashboard
    Route::get('/api/cliente/proyectos', function () {
        $user = auth()->user();

        return response()->json(
            $user->proyectos()->with('tareas')->get()->map(function ($p) {
                $totalTareas = $p->tareas->count();
                $completadas = $p->tareas->where('status', 'Completada')->count();
                $pendientes = $p->tareas->where('status', 'Pendiente')->count();
                $progreso = $totalTareas > 0 ? round(($completadas / $totalTareas) * 100) : 0;

                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'description' => $p->description,
                    'status' => $p->status,
                    'progress' => $progreso,
                    'tareas_count' => $totalTareas,
                    'tareas_completadas' => $completadas,
                    'tareas_pendientes' => $pendientes,
                ];
            })
        );
    });

    Route::get('/buscar', function (Request $request) {
        $query = $request->input('q');

        if (! $query) {
            return inertia('buscar', [
                'results' => [
                    'projects' => [],
                    'tasks' => [],
                    'clients' => [],
                    'users' => [],
                ],
                'query' => '',
            ]);
        }

        $projects = Proyecto::where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->get();

        $tasks = Tarea::where('title', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->get();

        $clients = Cliente::where('name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->orWhere('empresa', 'like', "%{$query}%")
            ->get();

        $users = User::where('name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->get();

        return inertia('buscar', [
            'results' => [
                'projects' => $projects,
                'tasks' => $tasks,
                'clients' => $clients,
                'users' => $users,
            ],
            'query' => $query,
        ]);
    })->name('search');

    Route::get('/api/search', function (Request $request) {
        $query = $request->input('q');

        if (! $query || strlen($query) < 2) {
            return response()->json(['results' => []]);
        }

        $projects = Proyecto::where('name', 'like', "%{$query}%")->take(3)->get();
        $tasks = Tarea::where('title', 'like', "%{$query}%")->take(3)->get();
        $users = User::where('name', 'like', "%{$query}%")->take(3)->get();

        $results = [];
        foreach ($projects as $p) {
            $results[] = ['id' => 'p'.$p->id, 'title' => $p->name, 'type' => 'Proyecto', 'href' => '/proyectos'];
        }
        foreach ($tasks as $t) {
            $results[] = ['id' => 't'.$t->id, 'title' => $t->title, 'type' => 'Tarea', 'href' => '/tareas'];
        }
        foreach ($users as $u) {
            $results[] = ['id' => 'u'.$u->id, 'title' => $u->name, 'type' => 'Usuario', 'href' => '/usuarios'];
        }

        return response()->json(['results' => $results]);
    });

    Route::get('/api/notifications', function () {
        $user = auth()->user();

        if ($user && $user->role === 'Cliente') {
            $proyectos = $user->proyectos()->with('tareas')->get();
            $notifications = $proyectos->map(function ($p) {
                $totalTareas = $p->tareas->count();
                $completadas = $p->tareas->where('status', 'Completada')->count();
                $progreso = $totalTareas > 0 ? round(($completadas / $totalTareas) * 100) : 0;

                return [
                    'title' => 'Avance de Proyecto',
                    'desc' => "Tu proyecto '{$p->name}' se encuentra al {$progreso}% de progreso.",
                    'time' => 'Actualizado ahora',
                    'unread' => true,
                    'type' => 'project',
                ];
            });

            return response()->json(['notifications' => $notifications]);
        }

        $recentProjects = Proyecto::with('cliente')->orderBy('created_at', 'desc')->take(2)->get()->map(function ($p) {
            $clienteName = $p->cliente ? $p->cliente->name : 'un cliente';

            return [
                'title' => 'Nuevo Proyecto',
                'desc' => "Se ha creado el proyecto '{$p->name}' para {$clienteName}.",
                'time' => $p->created_at ? $p->created_at->diffForHumans() : 'Recientemente',
                'unread' => true,
                'type' => 'project',
            ];
        });

        $contactoNotif = [
            'title' => 'Nuevo Mensaje de Cliente',
            'desc' => 'El cliente Carlos Ramírez (Constructora Cobán) ha enviado un mensaje de soporte.',
            'time' => 'Hace 15 minutos',
            'unread' => true,
            'type' => 'message',
        ];

        $notifications = collect([$contactoNotif])->concat($recentProjects)->values()->all();

        return response()->json(['notifications' => $notifications]);
    });

    Route::post('/api/mensajes', function (Request $request) {
        $user = auth()->user();
        if (! $user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $mensaje = Mensaje::create([
            'user_id' => $user->id,
            'type' => $request->type ?? 'soporte',
            'subject' => $request->subject,
            'content' => $request->content,
            'status' => 'pendiente',
        ]);

        return response()->json(['success' => true, 'mensaje' => $mensaje]);
    });

    Route::get('/api/mensajes', function () {
        $mensajes = Mensaje::with('user')->orderBy('created_at', 'desc')->get();

        return response()->json($mensajes);
    });

    Route::post('/api/mensajes/{id}/read', function ($id) {
        $mensaje = Mensaje::find($id);
        if ($mensaje) {
            $mensaje->update(['status' => 'leido']);

            return response()->json(['success' => true]);
        }

        return response()->json(['error' => 'Not found'], 404);
    });

    Route::get('/api/dashboard', function () {
        $clientesCount = Cliente::count();
        $proyectosActivosCount = Proyecto::where('status', 'En progreso')->count();
        $tareasPendientesCount = Tarea::where('status', 'Pendiente')->count();
        $usuariosCount = User::count();

        // Chart Data (same logic as reports)
        $monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        $chartData = [];
        $proyectos = Proyecto::all();
        $tareas = Tarea::all();

        foreach ($monthNames as $i => $name) {
            $month = $i + 1;
            $pCount = $proyectos->filter(function ($p) use ($month) {
                return $p->created_at && GuatemalaTime::monthInZone($p->created_at) === $month;
            })->count();
            $tCount = $tareas->filter(function ($t) use ($month) {
                return $t->created_at && GuatemalaTime::monthInZone($t->created_at) === $month;
            })->count();
            $chartData[] = ['name' => $name, 'proyectos' => $pCount, 'tareas' => $tCount];
        }

        // Recent Activities
        $recentProjects = Proyecto::orderBy('created_at', 'desc')->take(2)->get()->map(function ($p) {
            return [
                'id' => 'p'.$p->id,
                'title' => 'Nuevo proyecto creado',
                'desc' => $p->name,
                'time' => $p->created_at?->diffForHumans() ?? 'Recientemente',
                'type' => 'project',
            ];
        });

        $recentTasks = Tarea::orderBy('created_at', 'desc')->take(2)->get()->map(function ($t) {
            return [
                'id' => 't'.$t->id,
                'title' => 'Nueva tarea registrada',
                'desc' => $t->title,
                'time' => $t->created_at?->diffForHumans() ?? 'Recientemente',
                'type' => 'task',
            ];
        });

        $recentActivities = $recentProjects->concat($recentTasks)->sortByDesc('time')->take(4)->values()->all();

        // Fallback for activities if empty
        if (empty($recentActivities)) {
            $recentActivities = [
                ['id' => 1, 'title' => 'Sin actividad', 'desc' => 'No hay registros recientes', 'time' => '-', 'type' => 'status'],
            ];
        }

        return response()->json([
            'stats' => [
                'clientes' => $clientesCount,
                'proyectos' => $proyectosActivosCount,
                'tareas' => $tareasPendientesCount,
                'usuarios' => $usuariosCount,
                'trends' => [
                    'clientes' => '+0%', // Can be calculated if needed
                    'proyectos' => '+0%',
                    'tareas' => '+0%',
                    'usuarios' => '+0%',
                ],
            ],
            'chartData' => $chartData,
            'recentActivities' => $recentActivities,
            'recentUsers' => User::orderBy('id', 'desc')->take(4)->get()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? 'N/A',
                    'role' => $user->role ?? 'Usuario',
                    'status' => $user->status ?? 'Activo',
                    'date' => $user->created_at ? GuatemalaTime::formatDateMonthYear($user->created_at) : 'N/A',
                ];
            }),
        ]);
    })->name('api.dashboard');

    // Catálogo de clientes (tabla `clientes`) — los IDs deben coincidir con `proyectos.cliente_id`
    Route::get('/api/clientes', function () {
        return response()->json(Cliente::orderBy('id', 'desc')->get());
    });

    Route::post('/api/clientes', function (Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:50',
            'password' => 'nullable|string|min:6',
        ]);

        $uid = auth()->id();
        $attrs = [
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'company' => $validated['company'] ?? null,
            'status' => $validated['status'] ?? 'Activo',
            'created_by' => $uid,
            'updated_by' => $uid,
        ];
        if (! empty($validated['password'])) {
            $attrs['password'] = Hash::make($validated['password']);
        }

        $cliente = Cliente::create($attrs);

        return response()->json(['success' => true, 'cliente' => $cliente]);
    });

    Route::put('/api/clientes/{id}', function (Request $request, $id) {
        $cliente = Cliente::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:50',
            'password' => 'nullable|string|min:6',
        ]);

        $attrs = [
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'company' => $validated['company'] ?? null,
            'status' => $validated['status'] ?? 'Activo',
            'updated_by' => auth()->id(),
        ];
        if (! empty($validated['password'])) {
            $attrs['password'] = Hash::make($validated['password']);
        }

        $cliente->update($attrs);

        return response()->json(['success' => true, 'cliente' => $cliente]);
    });

    Route::delete('/api/clientes/{id}', function ($id) {
        Cliente::findOrFail($id)->delete();

        return response()->json(['success' => true]);
    });

    // Real API for Usuarios
    Route::get('/api/usuarios', function () {
        $usuarios = User::query()
            ->whereNot('role', 'Cliente')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? '',
                    'role' => $user->role ?? 'Usuario',
                    'status' => $user->status ?? 'Activo',
                    'date' => $user->created_at ? GuatemalaTime::formatDateMonthYear($user->created_at) : 'N/A',
                ];
            });

        return response()->json($usuarios);
    });

    Route::post('/api/usuarios', function (Request $request) {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:50',
            'role' => ['required', 'string', Rule::notIn(['Cliente'])],
            'status' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        $data['password'] = Hash::make($data['password']);
        $usuario = User::create($data);

        $responseUser = [
            'id' => $usuario->id,
            'name' => $usuario->name,
            'email' => $usuario->email,
            'phone' => $usuario->phone,
            'role' => $usuario->role,
            'status' => $usuario->status,
            'date' => GuatemalaTime::formatDateMonthYear($usuario->created_at),
        ];

        return response()->json(['success' => true, 'usuario' => $responseUser]);
    });

    Route::put('/api/usuarios/{id}', function (Request $request, $id) {
        $usuario = User::query()->where('id', $id)->whereNot('role', 'Cliente')->firstOrFail();

        $request->validate([
            'role' => ['required', 'string', Rule::notIn(['Cliente'])],
        ]);

        $data = $request->only(['name', 'email', 'phone', 'role', 'status']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $usuario->update($data);

        return response()->json(['success' => true]);
    });

    Route::delete('/api/usuarios/{id}', function ($id) {
        User::query()->where('id', $id)->whereNot('role', 'Cliente')->firstOrFail()->delete();

        return response()->json(['success' => true]);
    });

    // Real API for Proyectos
    Route::get('/api/proyectos', function () {
        return response()->json(
            Proyecto::with(['cliente', 'createdBy', 'updatedBy'])->orderBy('id', 'desc')->get()->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'description' => $p->description,
                    'status' => $p->status,
                    'cliente_id' => $p->cliente_id,
                    'cliente_name' => $p->cliente?->name ?? 'Sin cliente',
                    'tareas_count' => $p->tareas()->count(),
                    'date' => $p->created_at ? GuatemalaTime::formatDateMonthYear($p->created_at) : 'N/A',
                    'created_at' => GuatemalaTime::formatDateTime($p->created_at),
                    'updated_at' => GuatemalaTime::formatDateTime($p->updated_at),
                    'created_by_name' => $p->createdBy?->name,
                    'updated_by_name' => $p->updatedBy?->name,
                ];
            })
        );
    });

    Route::post('/api/proyectos', function (Request $request) {
        $uid = auth()->id();
        $data = array_merge($request->only(['name', 'description', 'cliente_id', 'status']), [
            'created_by' => $uid,
            'updated_by' => $uid,
        ]);
        $proyecto = Proyecto::create($data);

        return response()->json(['success' => true, 'proyecto' => $proyecto]);
    });

    Route::put('/api/proyectos/{id}', function (Request $request, $id) {
        $proyecto = Proyecto::findOrFail($id);
        $data = array_merge($request->only(['name', 'description', 'cliente_id', 'status']), [
            'updated_by' => auth()->id(),
        ]);
        $proyecto->update($data);

        return response()->json(['success' => true]);
    });

    Route::delete('/api/proyectos/{id}', function ($id) {
        Proyecto::destroy($id);

        return response()->json(['success' => true]);
    });

    // Real API for Tareas
    Route::get('/api/tareas', function () {
        return response()->json(
            Tarea::with(['proyecto', 'user', 'createdBy', 'updatedBy'])->orderBy('id', 'desc')->get()->map(function ($t) {
                return [
                    'id' => $t->id,
                    'title' => $t->title,
                    'description' => $t->description,
                    'status' => $t->status,
                    'proyecto_id' => $t->proyecto_id,
                    'proyecto_name' => $t->proyecto?->name ?? 'Sin proyecto',
                    'user_id' => $t->user_id,
                    'user_name' => $t->user?->name ?? 'Sin asignar',
                    'date' => $t->created_at ? GuatemalaTime::formatDateMonthYear($t->created_at) : 'N/A',
                    'created_at' => GuatemalaTime::formatDateTime($t->created_at),
                    'updated_at' => GuatemalaTime::formatDateTime($t->updated_at),
                    'created_by_name' => $t->createdBy?->name,
                    'updated_by_name' => $t->updatedBy?->name,
                ];
            })
        );
    });

    Route::post('/api/tareas', function (Request $request) {
        $uid = auth()->id();
        $attrs = $request->only(['proyecto_id', 'user_id', 'title', 'description', 'status']);
        $tarea = Tarea::create(array_merge($attrs, [
            'created_by' => $uid,
            'updated_by' => $uid,
        ]));

        return response()->json(['success' => true, 'tarea' => $tarea]);
    });

    Route::put('/api/tareas/{id}', function (Request $request, $id) {
        $tarea = Tarea::findOrFail($id);
        $attrs = $request->only(['proyecto_id', 'user_id', 'title', 'description', 'status']);
        $tarea->update(array_merge($attrs, [
            'updated_by' => auth()->id(),
        ]));

        return response()->json(['success' => true]);
    });

    Route::delete('/api/tareas/{id}', function ($id) {
        Tarea::destroy($id);

        return response()->json(['success' => true]);
    });

    // Real API for Reportes
    Route::get('/api/reportes', function () {
        $proyectos = Proyecto::with(['cliente', 'tareas'])->orderBy('id', 'desc')->get();
        $tareas = Tarea::all();
        $clientes = Cliente::all();
        $usuarios = User::all();

        // Task status distribution
        $tareasCompletadas = $tareas->where('status', 'Completada')->count();
        $tareasEnProgreso = $tareas->where('status', 'En progreso')->count();
        $tareasPendientes = $tareas->where('status', 'Pendiente')->count();
        $totalTareas = $tareas->count();

        // Project status distribution
        $proyectosEnProgreso = $proyectos->where('status', 'En progreso')->count();
        $proyectosCompletados = $proyectos->where('status', 'Completado')->count();
        $proyectosPausados = $proyectos->where('status', 'Pausado')->count();

        // Monthly data: group projects and tasks by creation month
        $monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        $monthlyData = [];
        foreach ($monthNames as $i => $name) {
            $month = $i + 1;
            $pCount = $proyectos->filter(function ($p) use ($month) {
                return $p->created_at && GuatemalaTime::monthInZone($p->created_at) === $month;
            })->count();
            $tCount = $tareas->filter(function ($t) use ($month) {
                return $t->created_at && GuatemalaTime::monthInZone($t->created_at) === $month;
            })->count();
            $monthlyData[] = ['name' => $name, 'proyectos' => $pCount, 'tareas' => $tCount];
        }

        // Project details for the table / PDF
        $proyectosList = $proyectos->map(function ($p) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'description' => $p->description,
                'status' => $p->status,
                'cliente_name' => $p->cliente?->name ?? 'Sin cliente',
                'tareas_total' => $p->tareas->count(),
                'tareas_completadas' => $p->tareas->where('status', 'Completada')->count(),
                'date' => $p->created_at ? GuatemalaTime::formatDateShort($p->created_at) : 'N/A',
            ];
        });

        return response()->json([
            'summary' => [
                'total_proyectos' => $proyectos->count(),
                'total_tareas' => $totalTareas,
                'total_clientes' => $clientes->count(),
                'total_usuarios' => $usuarios->count(),
            ],
            'tareas_dist' => [
                'completadas' => $tareasCompletadas,
                'en_progreso' => $tareasEnProgreso,
                'pendientes' => $tareasPendientes,
                'total' => $totalTareas,
            ],
            'proyectos_dist' => [
                'en_progreso' => $proyectosEnProgreso,
                'completados' => $proyectosCompletados,
                'pausados' => $proyectosPausados,
            ],
            'monthly' => $monthlyData,
            'proyectos' => $proyectosList,
        ]);
    });

    // Real API for Roles & Permissions
    Route::get('/api/roles', function () {
        $roles = Role::with('permissions')->get()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->toArray(),
            ];
        });

        $permissions = Permission::all()->map(function ($p) {
            return [
                'id' => $p->name,
                'label' => $p->label,
                'group' => $p->group,
                'desc' => $p->description,
            ];
        });

        return response()->json([
            'roles' => $roles,
            'all_permissions' => $permissions,
        ]);
    });

    Route::post('/api/roles', function (Request $request) {
        $request->validate(['name' => 'required|unique:roles,name']);
        $role = Role::create(['name' => $request->name]);

        return response()->json(['success' => true, 'role' => $role]);
    });

    Route::put('/api/roles/{id}', function (Request $request, $id) {
        $role = Role::findOrFail($id);

        if ($request->has('name')) {
            $role->update(['name' => $request->name]);
        }

        if ($request->has('permissions')) {
            $permissionIds = Permission::whereIn('name', $request->permissions)->pluck('id');
            $role->permissions()->sync($permissionIds);
        }

        return response()->json(['success' => true]);
    });

    Route::delete('/api/roles/{id}', function ($id) {
        $role = Role::findOrFail($id);
        if ($role->name === 'Administrador') {
            return response()->json(['error' => 'No se puede eliminar el rol Administrador'], 403);
        }
        $role->delete();

        return response()->json(['success' => true]);
    });
});

require __DIR__.'/settings.php';
