<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('products')->insert([
            ['name' => 'Пицца Маргарита', 'price' => 450.00, 'tags' => '["pizza", "vegetarian", "classic"]'],
            ['name' => 'Пицца Пепперони', 'price' => 580.00, 'tags' => '["pizza", "meat", "spicy"]'],
            ['name' => 'Пицца 4 Сыра', 'price' => 620.00, 'tags' => '["pizza", "vegetarian", "cheese"]'],
            ['name' => 'Пицца Мясная', 'price' => 750.00, 'tags' => '["pizza", "meat", "bacon", "ham"]'],
            ['name' => 'Ролл Филадельфия', 'price' => 490.00, 'tags' => '["sushi", "rolls", "salmon", "cheese"]'],
            ['name' => 'Ролл Калифорния', 'price' => 420.00, 'tags' => '["sushi", "rolls", "crab", "avocado"]'],
            ['name' => 'Ролл Канада', 'price' => 510.00, 'tags' => '["sushi", "rolls", "eel"]'],
            ['name' => 'Запеченный ролл с курицей', 'price' => 380.00, 'tags' => '["sushi", "rolls", "chicken", "hot"]'],
            ['name' => 'Сет "Для двоих"', 'price' => 1500.00, 'tags' => '["set", "rolls", "mix"]'],
            ['name' => 'Сет "Вечеринка"', 'price' => 3200.00, 'tags' => '["set", "rolls", "pizza", "big"]'],
            ['name' => 'Wok Курица Терияки', 'price' => 350.00, 'tags' => '["wok", "chicken", "noodles"]'],
            ['name' => 'Wok Говядина в перечном соусе', 'price' => 410.00, 'tags' => '["wok", "meat", "spicy"]'],
            ['name' => 'Суп Том Ям', 'price' => 450.00, 'tags' => '["soup", "hot", "spicy", "seafood"]'],
            ['name' => 'Coca-Cola 0.5л', 'price' => 100.00, 'tags' => '["drink", "soda", "cold"]'],
            ['name' => 'Морс Клюквенный', 'price' => 120.00, 'tags' => '["drink", "natural", "berry"]'],
        ]);
    }
}
