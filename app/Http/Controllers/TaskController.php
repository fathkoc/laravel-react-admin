<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Jobs\StartTaskJob;
use App\Notifications\TaskStatusChanged;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TaskController extends Controller
{

    public function index()
    {

        $tasks = Cache::remember('tasks', 60, function () {
            return Task::with('user')->get();
        });

        return response()->json($tasks);
    }


    public function store(Request $request)
    {
        $task = Task::create($request->all());

        $startTime = $request->input('start_time');

        if ($startTime) {
            StartTaskJob::dispatch($task)->delay($startTime);
        }
        Cache::forget('tasks');

        return response()->json($task, 201);
    }


    public function update(Request $request, Task $task)
    {
        $task->update($request->all());
        $task->notify(new TaskStatusChanged($task));

        Cache::forget('tasks');

        return response()->json($task);
    }

    // Görev silme
    public function destroy(Task $task)
    {
        $task->delete();
        Cache::forget('tasks');

        return response()->json(null, 204);
    }
}
