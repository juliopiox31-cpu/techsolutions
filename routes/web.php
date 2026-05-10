<?php

use Illuminate\Support\Facades\Route;
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
        $trabajadores = \App\Models\User::where('role', 'Trabajador')
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
                    'total_tareas' => $trabajador->tareasAsignadas->count()
                ];
            });

        return response()->json($trabajadores);
    });

    // API for Client Dashboard
    Route::get('/api/cliente/proyectos', function () {
        $user = auth()->user();
        return response()->json(
            $user->proyectos()->with('tareas')->get()->map(function($p) {
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

    Route::get('/buscar', function (\Illuminate\Http\Request $request) {
        $query = $request->input('q');
        
        if (!$query) {
            return inertia('buscar', [
                'results' => [
                    'projects' => [],
                    'tasks' => [],
                    'clients' => [],
                    'users' => [],
                ],
                'query' => ''
            ]);
        }

        $projects = \App\Models\Proyecto::where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->get();

        $tasks = \App\Models\Tarea::where('title', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->get();

        $clients = \App\Models\Cliente::where('name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->orWhere('empresa', 'like', "%{$query}%")
            ->get();

        $users = \App\Models\User::where('name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->get();

        return inertia('buscar', [
            'results' => [
                'projects' => $projects,
                'tasks' => $tasks,
                'clients' => $clients,
                'users' => $users,
            ],
            'query' => $query
        ]);
    })->name('search');

    Route::get('/api/search', function (\Illuminate\Http\Request $request) {
        $query = $request->input('q');
        
        if (!$query || strlen($query) < 2) {
            return response()->json(['results' => []]);
        }

        $projects = \App\Models\Proyecto::where('name', 'like', "%{$query}%")->take(3)->get();
        $tasks = \App\Models\Tarea::where('title', 'like', "%{$query}%")->take(3)->get();
        $users = \App\Models\User::where('name', 'like', "%{$query}%")->take(3)->get();

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
            $notifications = $proyectos->map(function($p) {
                $totalTareas = $p->tareas->count();
                $completadas = $p->tareas->where('status', 'Completada')->count();
                $progreso = $totalTareas > 0 ? round(($completadas / $totalTareas) * 100) : 0;
                
                return [
                    'title' => 'Avance de Proyecto',
                    'desc' => "Tu proyecto '{$p->name}' se encuentra al {$progreso}% de progreso.",
                    'time' => 'Actualizado ahora',
                    'unread' => true,
                    'type' => 'project'
                ];
            });
            return response()->json(['notifications' => $notifications]);
        }
        
        $recentProjects = \App\Models\Proyecto::with('cliente')->orderBy('created_at', 'desc')->take(2)->get()->map(function($p) {
            $clienteName = $p->cliente ? $p->cliente->name : 'un cliente';
            return [
                'title' => 'Nuevo Proyecto',
                'desc' => "Se ha creado el proyecto '{$p->name}' para {$clienteName}.",
                'time' => $p->created_at ? $p->created_at->diffForHumans() : 'Recientemente',
                'unread' => true,
                'type' => 'project'
            ];
        });

        $contactoNotif = [
            'title' => 'Nuevo Mensaje de Cliente',
            'desc' => 'El cliente Carlos Ramírez (Constructora Cobán) ha enviado un mensaje de soporte.',
            'time' => 'Hace 15 minutos',
            'unread' => true,
            'type' => 'message'
        ];

        $notifications = collect([$contactoNotif])->concat($recentProjects)->values()->all();

        return response()->json(['notifications' => $notifications]);
    });

    Route::post('/api/mensajes', function (\Illuminate\Http\Request $request) {
        $user = auth()->user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);
        
        $mensaje = \App\Models\Mensaje::create([
            'user_id' => $user->id,
            'type' => $request->type ?? 'soporte',
            'subject' => $request->subject,
            'content' => $request->content,
            'status' => 'pendiente'
        ]);
        
        return response()->json(['success' => true, 'mensaje' => $mensaje]);
    });

    Route::get('/api/mensajes', function () {
        $mensajes = \App\Models\Mensaje::with('user')->orderBy('created_at', 'desc')->get();
        return response()->json($mensajes);
    });

    Route::post('/api/mensajes/{id}/read', function ($id) {
        $mensaje = \App\Models\Mensaje::find($id);
        if ($mensaje) {
            $mensaje->update(['status' => 'leido']);
            return response()->json(['success' => true]);
        }
        return response()->json(['error' => 'Not found'], 404);
    });

    Route::get('/api/dashboard', function () {
        $clientesCount = \App\Models\Cliente::count();
        $proyectosActivosCount = \App\Models\Proyecto::where('status', 'En progreso')->count();
        $tareasPendientesCount = \App\Models\Tarea::where('status', 'Pendiente')->count();
        $usuariosCount = \App\Models\User::count();

        // Chart Data (same logic as reports)
        $monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        $chartData = [];
        $proyectos = \App\Models\Proyecto::all();
        $tareas = \App\Models\Tarea::all();
        
        foreach ($monthNames as $i => $name) {
            $month = $i + 1;
            $pCount = $proyectos->filter(function($p) use ($month) {
                return $p->created_at && $p->created_at->month === $month;
            })->count();
            $tCount = $tareas->filter(function($t) use ($month) {
                return $t->created_at && $t->created_at->month === $month;
            })->count();
            $chartData[] = ['name' => $name, 'proyectos' => $pCount, 'tareas' => $tCount];
        }

        // Recent Activities
        $recentProjects = \App\Models\Proyecto::orderBy('created_at', 'desc')->take(2)->get()->map(function($p) {
            return [
                'id' => 'p' . $p->id,
                'title' => 'Nuevo proyecto creado',
                'desc' => $p->name,
                'time' => $p->created_at?->diffForHumans() ?? 'Recientemente',
                'type' => 'project'
            ];
        });

        $recentTasks = \App\Models\Tarea::orderBy('created_at', 'desc')->take(2)->get()->map(function($t) {
            return [
                'id' => 't' . $t->id,
                'title' => 'Nueva tarea registrada',
                'desc' => $t->title,
                'time' => $t->created_at?->diffForHumans() ?? 'Recientemente',
                'type' => 'task'
            ];
        });

        $recentActivities = $recentProjects->concat($recentTasks)->sortByDesc('time')->take(4)->values()->all();
        
        // Fallback for activities if empty
        if (empty($recentActivities)) {
            $recentActivities = [
                ['id' => 1, 'title' => 'Sin actividad', 'desc' => 'No hay registros recientes', 'time' => '-', 'type' => 'status']
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
                    'usuarios' => '+0%'
                ]
            ],
            'chartData' => $chartData,
            'recentActivities' => $recentActivities,
            'recentUsers' => \App\Models\User::orderBy('id', 'desc')->take(4)->get()->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? 'N/A',
                    'role' => $user->role ?? 'Usuario',
                    'status' => $user->status ?? 'Activo',
                    'date' => $user->created_at ? $user->created_at->format('d M Y') : 'N/A'
                ];
            })
        ]);
    })->name('api.dashboard');

    // Real API for Clientes (now using Users with role 'Cliente')
    Route::get('/api/clientes', function () {
        return response()->json(\App\Models\User::where('role', 'Cliente')->orderBy('id', 'desc')->get());
    });

    Route::post('/api/clientes', function (\Illuminate\Http\Request $request) {
        $data = $request->all();
        $data['role'] = 'Cliente';
        if ($request->filled('password')) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
        }
        $cliente = \App\Models\User::create($data);
        return response()->json(['success' => true, 'cliente' => $cliente]);
    });

    Route::put('/api/clientes/{id}', function (\Illuminate\Http\Request $request, $id) {
        $cliente = \App\Models\User::where('role', 'Cliente')->findOrFail($id);
        $data = $request->all();
        if ($request->filled('password')) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
        } else {
            unset($data['password']);
        }
        $cliente->update($data);
        return response()->json(['success' => true]);
    });

    Route::delete('/api/clientes/{id}', function ($id) {
        \App\Models\User::where('role', 'Cliente')->findOrFail($id)->delete();
        return response()->json(['success' => true]);
    });

    // Real API for Usuarios
    Route::get('/api/usuarios', function () {
        $usuarios = \App\Models\User::orderBy('id', 'desc')->get()->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'role' => $user->role ?? 'Usuario',
                'status' => $user->status ?? 'Activo',
                'date' => $user->created_at ? $user->created_at->format('d M Y') : 'N/A'
            ];
        });
        return response()->json($usuarios);
    });

    Route::post('/api/usuarios', function (\Illuminate\Http\Request $request) {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:50',
            'role' => 'required|string',
            'status' => 'required|string',
            'password' => 'required|string|min:8',
        ]);
        
        $data['password'] = \Illuminate\Support\Facades\Hash::make($data['password']);
        $usuario = \App\Models\User::create($data);
        
        $responseUser = [
            'id' => $usuario->id,
            'name' => $usuario->name,
            'email' => $usuario->email,
            'phone' => $usuario->phone,
            'role' => $usuario->role,
            'status' => $usuario->status,
            'date' => $usuario->created_at->format('d M Y')
        ];
        return response()->json(['success' => true, 'usuario' => $responseUser]);
    });

    Route::put('/api/usuarios/{id}', function (\Illuminate\Http\Request $request, $id) {
        $usuario = \App\Models\User::findOrFail($id);
        
        $data = $request->only(['name', 'email', 'phone', 'role', 'status']);
        
        if ($request->filled('password')) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
        }
        
        $usuario->update($data);
        return response()->json(['success' => true]);
    });

    Route::delete('/api/usuarios/{id}', function ($id) {
        \App\Models\User::destroy($id);
        return response()->json(['success' => true]);
    });

    // Real API for Proyectos
    Route::get('/api/proyectos', function () {
        return response()->json(
            \App\Models\Proyecto::with('cliente')->orderBy('id', 'desc')->get()->map(function($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'description' => $p->description,
                    'status' => $p->status,
                    'cliente_id' => $p->cliente_id,
                    'cliente_name' => $p->cliente?->name ?? 'Sin cliente',
                    'tareas_count' => $p->tareas()->count(),
                    'date' => $p->created_at?->format('d M Y') ?? 'N/A',
                ];
            })
        );
    });

    Route::post('/api/proyectos', function (\Illuminate\Http\Request $request) {
        $proyecto = \App\Models\Proyecto::create($request->all());
        return response()->json(['success' => true, 'proyecto' => $proyecto]);
    });

    Route::put('/api/proyectos/{id}', function (\Illuminate\Http\Request $request, $id) {
        $proyecto = \App\Models\Proyecto::findOrFail($id);
        $proyecto->update($request->all());
        return response()->json(['success' => true]);
    });

    Route::delete('/api/proyectos/{id}', function ($id) {
        \App\Models\Proyecto::destroy($id);
        return response()->json(['success' => true]);
    });

    // Real API for Tareas
    Route::get('/api/tareas', function () {
        return response()->json(
            \App\Models\Tarea::with(['proyecto', 'user'])->orderBy('id', 'desc')->get()->map(function($t) {
                return [
                    'id' => $t->id,
                    'title' => $t->title,
                    'description' => $t->description,
                    'status' => $t->status,
                    'proyecto_id' => $t->proyecto_id,
                    'proyecto_name' => $t->proyecto?->name ?? 'Sin proyecto',
                    'user_id' => $t->user_id,
                    'user_name' => $t->user?->name ?? 'Sin asignar',
                    'date' => $t->created_at?->format('d M Y') ?? 'N/A',
                ];
            })
        );
    });

    Route::post('/api/tareas', function (\Illuminate\Http\Request $request) {
        $tarea = \App\Models\Tarea::create($request->all());
        return response()->json(['success' => true, 'tarea' => $tarea]);
    });

    Route::put('/api/tareas/{id}', function (\Illuminate\Http\Request $request, $id) {
        $tarea = \App\Models\Tarea::findOrFail($id);
        $tarea->update($request->all());
        return response()->json(['success' => true]);
    });

    Route::delete('/api/tareas/{id}', function ($id) {
        \App\Models\Tarea::destroy($id);
        return response()->json(['success' => true]);
    });

    // Real API for Reportes
    Route::get('/api/reportes', function () {
        $proyectos = \App\Models\Proyecto::with(['cliente', 'tareas'])->orderBy('id', 'desc')->get();
        $tareas = \App\Models\Tarea::all();
        $clientes = \App\Models\Cliente::all();
        $usuarios = \App\Models\User::all();

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
        $monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        $monthlyData = [];
        foreach ($monthNames as $i => $name) {
            $month = $i + 1;
            $pCount = $proyectos->filter(function($p) use ($month) {
                return $p->created_at && $p->created_at->month === $month;
            })->count();
            $tCount = $tareas->filter(function($t) use ($month) {
                return $t->created_at && $t->created_at->month === $month;
            })->count();
            $monthlyData[] = ['name' => $name, 'proyectos' => $pCount, 'tareas' => $tCount];
        }

        // Project details for the table / PDF
        $proyectosList = $proyectos->map(function($p) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'description' => $p->description,
                'status' => $p->status,
                'cliente_name' => $p->cliente?->name ?? 'Sin cliente',
                'tareas_total' => $p->tareas->count(),
                'tareas_completadas' => $p->tareas->where('status', 'Completada')->count(),
                'date' => $p->created_at?->format('d/m/Y') ?? 'N/A',
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
        $roles = \App\Models\Role::with('permissions')->get()->map(function($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->toArray()
            ];
        });
        
        $permissions = \App\Models\Permission::all()->map(function($p) {
            return [
                'id' => $p->name,
                'label' => $p->label,
                'group' => $p->group,
                'desc' => $p->description
            ];
        });

        return response()->json([
            'roles' => $roles,
            'all_permissions' => $permissions
        ]);
    });

    Route::post('/api/roles', function (\Illuminate\Http\Request $request) {
        $request->validate(['name' => 'required|unique:roles,name']);
        $role = \App\Models\Role::create(['name' => $request->name]);
        return response()->json(['success' => true, 'role' => $role]);
    });

    Route::put('/api/roles/{id}', function (\Illuminate\Http\Request $request, $id) {
        $role = \App\Models\Role::findOrFail($id);
        
        if ($request->has('name')) {
            $role->update(['name' => $request->name]);
        }
        
        if ($request->has('permissions')) {
            $permissionIds = \App\Models\Permission::whereIn('name', $request->permissions)->pluck('id');
            $role->permissions()->sync($permissionIds);
        }
        
        return response()->json(['success' => true]);
    });

    Route::delete('/api/roles/{id}', function ($id) {
        $role = \App\Models\Role::findOrFail($id);
        if ($role->name === 'Administrador') {
            return response()->json(['error' => 'No se puede eliminar el rol Administrador'], 403);
        }
        $role->delete();
        return response()->json(['success' => true]);
    });
});

require __DIR__.'/settings.php';
