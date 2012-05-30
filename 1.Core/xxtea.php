<?php
/**
* @author      Ma Bingyao(andot@ujn.edu.cn)
* @copyright   CoolCode.CN
* @package     XXTEA
* @version     1.1
* @lastupdate 2006-03-07
* @link        http://www.coolcode.cn/?p=128
*/
 
function long2str($v, $w) {
    $len = count($v);
    $s = array();
    for ($i = 0; $i < $len; $i++)
    {
        $s[$i] = pack("V", $v[$i] & 0xffffffff);
    }
    if ($w) {
        return substr(join('', $s), 0, $v[$len - 1] & 0xffffffff);
    }
    else {
        return join('', $s);
    }
}
 
function str2long($s, $w) {
    $v = unpack("V*", $s. str_repeat("\0", (4 - strlen($s) % 4) & 3));
    $v = array_values($v);
    if ($w) {
        $v[count($v)] = strlen($s);
    }
    return $v;
}
 
function xxtea_decrypt($str, $key) {
    if ($str == "") {
        return "";
    }
    $v = explode(',', $str);
    $k = str2long($key, false);
    $n = count($v);
 
    $z = $v[$n - 1];
    $y = $v[0];
    $delta = 0x9E3779B9;
    $q = (int)(6 + 52 / $n);
    $sum = $q * $delta & 0xffffffff;
    while ($sum != 0) {
        $e = $sum >> 2 & 3;
        for ($p = $n - 1; $p > 0; $p--) {
            $z = $v[$p - 1];
            $mx = (($z >> 5 & 0x07ffffff) ^ $y << 2) + (($y >> 3 & 0x1fffffff) ^ $z << 4) ^ ($sum ^ $y) + ($k[$p & 3 ^ $e] ^ $z);
            $y = $v[$p] = $v[$p] - $mx & 0xffffffff;
        }
        $z = $v[$n - 1];
        $mx = (($z >> 5 & 0x07ffffff) ^ $y << 2) + (($y >> 3 & 0x1fffffff) ^ $z << 4) ^ ($sum ^ $y) + ($k[$p & 3 ^ $e] ^ $z);
        $y = $v[0] = $v[0] - $mx & 0xffffffff;
        $sum = $sum - $delta & 0xffffffff;
    }
 
    return long2str($v, true);
}
?>
