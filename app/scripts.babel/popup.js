'use strict';

$(function(){
  $.ajax({
    type: 'GET',
    url: 'http://akizukidenshi.com/catalog/cart/cart.aspx',
    async: false
  }).done(function(data){
    var isEmpty = $(data).find('form:last > .cart_table').length == 0;
    if(isEmpty){
      $('#status').html('カートの中身が空です。');
      return;
    }
    var csvtext = 'OrderCode,Name,Price,Quantity,Total,URL\n';
    var itemCount = 0, allTotal = 0;
    $(data).find('form:last > .cart_table tr').each(function(){
      if($(this).find('a').length != 0){
        // Item
        itemCount++;
        var orderCode = $(this).find('td:eq(0) > a:first').text();
        var name = $(this).find('td:eq(1) > a:last').text();
        var price = parseInt($(this).find('td:eq(2) > span:first').text().replace(/[^0-9^\.]/g,''), 10);
        var qty = $(this).find('td:eq(3) > input:first').val();
        var total = parseInt($(this).find('td:eq(4) > span:first').text().replace(/[^0-9^\.]/g,''), 10);
        var url = 'http://akizukidenshi.com/catalog/g/g' + orderCode;
        csvtext += orderCode + ',' + name + ',' + price + ',' + qty + ',' + total + ',' + url + '\n';
        allTotal += total
      }
    });
    $('#status').html('カートの中に' + itemCount + '点の商品があり，合計金額は' + allTotal + '円です。');
    console.log(csvtext);
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    var blob = new Blob([bom, csvtext], {'type' : 'text/csv'});
    var url = URL.createObjectURL(blob);
    $('#save').attr('href', url);
    $('#save').attr('download', 'cart.csv')
  });
})
