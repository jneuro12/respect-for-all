<?php
include('../../cms/includes/db.php');
header('Content-Type: application/json');

$_POST = array_map_r("strip_tags", $_POST);


if($_POST['id'] != 0){
	$data = DB::queryFirstField('select dataPacket from screenings where id=%i',$_POST['id']);	
	
	echo $data;
}






function array_map_r( $func, $arr )
{
    $newArr = array();

    foreach( $arr as $key => $value )
    {
        $newArr[ $key ] = ( is_array( $value ) ? array_map_r( $func, $value ) : ( is_array($func) ? call_user_func_array($func, $value) : $func( $value ) ) );
    }

    return $newArr;
}

?>