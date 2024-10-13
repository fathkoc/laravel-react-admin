<?php

use App\Models\Task;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // 50 adet sahte görev oluştur
        factory(Task::class, 50)->create(); // factory() methodunu kullanarak 50 adet görev oluşturuyoruz
    }
}
