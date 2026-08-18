<?php
$modelsDir = __DIR__ . '/app/Models';
$files = scandir($modelsDir);

foreach ($files as $file) {
    if (in_array($file, ['.', '..', 'User.php'])) continue;
    $path = $modelsDir . '/' . $file;
    $content = file_get_contents($path);
    
    // Check if $guarded is already there
    if (strpos($content, '$guarded') === false) {
        // Insert right after the opening brace of the class
        $content = preg_replace('/class\s+[a-zA-Z0-9_]+\s+extends\s+Model\s*\{/', "$0\n    protected \$guarded = ['id'];\n", $content);
        file_put_contents($path, $content);
    }
}
echo "Fixed guarded using brace replacement.\n";
