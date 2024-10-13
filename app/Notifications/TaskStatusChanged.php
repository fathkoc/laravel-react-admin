<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class TaskStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    protected $task;

    public function __construct($task)
    {
        $this->task = $task;
    }

    public function via($notifiable)
    {
        return ['database'];  // Veritabanı üzerinden bildirim gönderiyoruz
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => 'Task "' . $this->task->title . '" is now ' . $this->task->status,
        ];
    }
}
