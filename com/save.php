<?php
include('../../cms/includes/db.php');
header('Content-Type: application/json');

$_POST = array_map_r("strip_tags", $_POST);
$data = json_decode($_POST['data']);

if($data->id == 0){
	DB::insert('screenings',
						 array('data'=>json_encode($data)));	
	
	$id = DB::insertId();
}
else{
	DB::update('screenings',
			  		array('data'=>json_encode($data)), "id=%i", $data->id);
	$id = $data->id;
}
echo $id;






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