
function add(id){
  var total = 0;
  for(var i =1; i<=$("#tr_d_counterEstimasiDetail").val(); i++){
      var row = i-1;
      if(id.substring(7,8) == row){
        var a = Number($("#qty-"+row).val());
        $("#qty-"+row).attr('value', a+1);

      }
      var qty = $("#qty-"+row).val();
      var price = $("#price-"+row).val();
      var subtotal = qty * price;
      total += subtotal;
      $("#total").attr('value', total);
    }


}



function del(id){
  var total = 0;
  for(var i =1; i<=$("#tr_d_counterEstimasiDetail").val(); i++){
      var row = i-1;
      if(id.substring(7,8) == row){
        var a = Number($("#qty-"+row).val());
        $("#qty-"+row).attr('value', a-1);
      }
      var qty = $("#qty-"+row).val();
      var price = $("#price-"+row).val();
      var subtotal = qty * price;
      total += subtotal;
      $("#total").attr('value', total);
    }
}
