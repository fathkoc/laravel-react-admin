<?php

namespace App\Http\Controllers;

use App\Models\Task; // Doğru namespace ile çağırıyoruz
use App\Jobs\StartTaskJob;
use App\Notifications\TaskStatusChanged;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TaskController extends Controller
{
    // Görevleri listeleme
    public function index()
    {
        // Görevleri cache'den getiriyoruz ve yoksa veritabanından çekip cache'e ekliyoruz
        $tasks = Cache::remember('tasks', 60, function () {
            return Task::with('user')->get(); // Kullanıcı bilgilerini de içerecek şekilde getir
        });

        return response()->json($tasks);
    }

    // Görev oluşturma
    public function store(Request $request)
    {
        // Görevi oluşturuyoruz
        $task = Task::create($request->all());

        // Görev başlangıç zamanını alıyoruz
        $startTime = $request->input('start_time');  

        // Başlama zamanı belirtilmişse job kuyruğa ekleniyor
        if ($startTime) {
            StartTaskJob::dispatch($task)->delay($startTime);  // Belirlenen zamanda iş kuyruğuna ekleniyor
        }

        // Yeni bir görev oluşturulduğunda cache'i temizliyoruz
        Cache::forget('tasks');

        return response()->json($task, 201);  // Başarılı yanıt dönüyoruz
    }

    // Görev güncelleme
    public function update(Request $request, Task $task)
    {
        // Görevi güncelliyoruz
        $task->update($request->all());

        // Görev durumu değiştiğinde bildirim gönderiyoruz
        $task->notify(new TaskStatusChanged($task));

        // Güncellemeden sonra cache'i temizliyoruz
        Cache::forget('tasks');

        return response()->json($task);
    }

    // Görev silme
    public function destroy(Task $task)
    {
        // Görevi siliyoruz
        $task->delete();

        // Silmeden sonra cache'i temizliyoruz
        Cache::forget('tasks');

        return response()->json(null, 204);  // Başarılı silme işlemi
    }
}
