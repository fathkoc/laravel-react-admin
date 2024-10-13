<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\User;
class Task extends Model
{
    // Diğer özellikler ve metotlar

    public function user()
    {
        return $this->belongsTo(User::class); // Kullanıcı ile ilişkisi
    }
}
