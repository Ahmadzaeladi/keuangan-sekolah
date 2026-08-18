<?php

$modelsDir = __DIR__ . '/app/Models';
$files = scandir($modelsDir);

foreach ($files as $file) {
    if (in_array($file, ['.', '..', 'User.php'])) continue;
    $path = $modelsDir . '/' . $file;
    $content = file_get_contents($path);
    
    // Check if $guarded is already there
    if (strpos($content, '$guarded') === false) {
        // Insert after 'use HasFactory;'
        $content = preg_replace('/(use HasFactory;)/', "$1\n    protected \$guarded = ['id'];", $content);
        file_put_contents($path, $content);
    }
}

echo "Guarded property added to models.\n";
