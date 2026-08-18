<?php
$modelsDir = __DIR__ . '/app/Models';
$files = scandir($modelsDir);

foreach ($files as $file) {
    if (in_array($file, ['.', '..', 'User.php'])) continue;
    $content = file_get_contents($modelsDir . '/' . $file);
    $content = str_replace(
        "use Illuminate\Database\Eloquent\Model;",
        "use Illuminate\Database\Eloquent\Model;\nuse Illuminate\Database\Eloquent\Relations\BelongsTo;\nuse Illuminate\Database\Eloquent\Relations\HasMany;",
        $content
    );
    $content = str_replace(
        "{\n    use HasFactory;\n}",
        "{\n    use HasFactory;\n    protected \$guarded = ['id'];\n}",
        $content
    );
    file_put_contents($modelsDir . '/' . $file, $content);
}

// Update User model manually
$userContent = file_get_contents($modelsDir . '/User.php');
$userContent = str_replace(
    "protected \$fillable = [",
    "protected \$fillable = [\n        'role',\n        'phone',\n",
    $userContent
);
file_put_contents($modelsDir . '/User.php', $userContent);
echo "Models populated.\n";
