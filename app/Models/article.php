<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class article extends Model
{
    use HasFactory;

    public function category()
    {
        return $this->belongsTo(categorie::class, 'category_id');
    }
    public function unit()
    {
        return $this->belongsTo(unit::class, 'unit_id');
    }
    public function itemsInWarehouse()
    {
        return $this->hasMany(warehouse::class, 'article_id');
    }

    public function achats()
    {
        return $this->hasMany(articleEnAchat::class, 'article_id');
    }

    public function branchements()
    {
        return $this->hasMany(articleEnBranchement::class, 'article_id');
    }
}
