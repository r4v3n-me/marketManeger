<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class employesEnBranchement extends Model
{
    use HasFactory;
    public function employe()
    {
        return $this->belongsTo(employe::class, 'employe_id');
    }
}
