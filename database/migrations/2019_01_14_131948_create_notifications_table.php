<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();  // Her bildirim için UUID benzersiz kimlik
            $table->string('type');  // Bildirimin tipi (örneğin, "TaskStatusChanged")
            
            // 'morphs' ile notifiable (bildirim alacak model) ilişkisini kuruyoruz
            $table->morphs('notifiable');  // Kullanıcı, admin, vs. kim bildirim alacak
            
            $table->text('data');  // Bildirimle ilgili veri JSON formatında saklanacak
            
            $table->timestamp('read_at')->nullable();  // Bildirim okunduğu zaman
            $table->timestamps();  // created_at ve updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}
