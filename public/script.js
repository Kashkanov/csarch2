$(document).ready(function(){
    // Convert input based on selected method
    $('#convertButton').on('click', function() {
        var inputElement = $('#inputValue');
        var outputElement = $('#outputValue');

        var input = $(inputElement).val();
        var method = $('#roundMethod').find(':selected').val();
        var combifield;
        var tempMSD;
        var tempbcd;
        var signbit;
        var expcont;
        var exp = 0;
        var significand;
       
        $(outputElement).css('color', 'black');

        if (input == '') {
            $(outputElement).val('No input given.');
            $(outputElement).css('color', 'red');
            return;
        }
        let pattern = /e/;
        let pattern1 = /E/;
        console.log(pattern.test(input.toString()));
        if (pattern.test(input.toString())){
            var array = input.split('e');
            significand = array[0];
            console.log(significand);
            exp = parseInt(array[1]);
            console.log("exps1");
            console.log(exp);
        }
        
   
        else if (pattern1.test(input.toString())){
            var array = input.split('E');
            significand = parseInt(array[0]);
            console.log(array[0]);
            exp = parseInt(array[1]);
            console.log("exps2");
            console.log(exp);
        }

        else{
            significand = input;
        }
        signbit = get_sign_bit(input);
        if(signbit == 1){
            significand = significand.substring(1);
            significand = parseInt(significand);
     
        }
        console.log(significand);
        while(significand.toString().includes('.')){
            significand = significand * 10;
            console.log(significand);
            exp = exp - 1;
        }
        while(significand.toString().length < 7){
            significand = significand * 10;
            exp = exp - 1;
        }
        
        /*5.673459e6*/
        significand = significand.toString();
        tempMSD = significand[0];
        tempbcd = significand.substring(1);
        switch(method) {
            case "option1":
                console.log(tempbcd);
                tempbcd = densely_fixer(tempbcd);
                expcont = get_exponent_continuation(exp);
                
                combifield = combination_field(expcont,tempMSD);
                expcont = expcont.substring(2);
                $('#outputValue').val(signbit + " " + combifield + " " + expcont + " " + tempbcd)
                break;
            case "option2":
                console.log('Option2 case');
                // Function or lines here
                $(outputElement).val('Converted value of ' + input + ' here.');
                break;
            case "option3":
                console.log('Option3 case');
                // Function or lines here
                $(outputElement).val('Converted value of ' + input + ' here.');
                break;
            default:
                console.log('Default case');
                $(outputElement).val('No rounding method selected.');
                $(outputElement).css('color', 'red');
        }
    });

    $('#resetButton').on('click', function() {
        $('#inputValue').val('');
        $('#outputValue').val('');
        $('#roundMethod').val('default');
    });

    // Copy text to clipboard
    $('#copyButton').on('click', function() {
        var text = $('#outputValue').val();

        // https://stackoverflow.com/questions/18812948/make-hidden-div-appear-then-fade-away
        $('.tooltiptext').finish().show().delay(1000).fadeOut("slow");

        navigator.clipboard.writeText(text);
    });
    /*
    console.log(unsigned_binary(1)); // 1
    console.log(unsigned_binary(-1)); // 11111111111111111111111111111111
    console.log(unsigned_binary(256)); // 100000000
    console.log(unsigned_binary(-256)); // 11111111111111111111111100000000
    console.log(unpacked_bcd(324))
    */
});

  function add_space(binary){
    var temp = '';
    var spaced = '';
    while ((binary.length % 4 ) != 0) {
        for(var i =0, len = sNumber.length;i < len; i+=1){
            temp = unsigned_binary(parseInt(sNumber.charAt(i)))
            while(temp.length < 8){
                temp = temp + sNumber.charAt(i)
                if(temp.length == 4){
                    spaced = spaced + temp + ' ';
                    temp = '';
                }
            }
            bcd = bcd + temp
        }
    }
    return spaced
}
function unpacked_bcd(decimal){
    var bcd = '';
    var output = [];
    var sNumber = decimal.toString();
    for(var i =0, len = sNumber.length;i < len; i+=1){
        temp = unsigned_binary(parseInt(sNumber.charAt(i)))
        while(temp.length < 8){
            temp = '0' + temp
        }
        bcd = bcd + temp
    }
    return bcd;
}

function packed_bcd(decimal){
    var bcd = '';
    var output = [];
    var sNumber = decimal.toString();
    for(var i =0, len = sNumber.length;i < len; i+=1){
        temp = unsigned_binary(parseInt(sNumber.charAt(i)))
        while(temp.length < 4){
            temp = '0' + temp;
        }
        bcd = bcd + temp;
    }
    console.log(bcd.toString());
    return bcd.toString();
}

function unsigned_binary(dec) {
    return (dec >>> 0).toString(2);
  }
function get_sign_bit(dec) {
    if (dec < 0){
        return 1;
    }
    return 0;
}
function get_exponent_continuation(exp){
    var expcon = exp + 101;
    expcon = unsigned_binary(expcon);
    while(expcon.length % 4 !=0){
        expcon = '0' + expcon;
    }
    return expcon;
}
function densely_packed(packed){
    
    while(packed.length < 12){
        packed = '0' + packed;
    }
    console.log(packed);
    var bcd = ['0', '0', '0', '0','0','0', '0', '0', '0', '0', '0', '0', '0'];
    var checker = [];
    checker = [packed[0], packed[4], packed[8]];
    bcd[0] = checker[0];
    bcd[1] = checker[1];
    bcd[2] = checker[2];
    if (checker[0] == '0' && checker[1] == '0' && checker[2] == '0'){
        bcd =packed[1] + packed[2] + packed[3] + packed[5] + packed[6] + packed[7] + '0' + packed[9] + packed[10] + packed[11];
    }
    else if(checker[0] == '0' && checker[1] == '0' && checker[2] == '1'){
        bcd = packed[1] + packed[2] + packed[3] + packed[5] + packed[6] + packed[7] + '1' + '0' + '0' + packed[11];
    }
    else if(checker[0] == '0' && checker[1] == '1' && checker[2] == '0'){
        bcd = packed[1] + packed[2] + packed[3] + packed[9] + packed[10] + packed[7] + '1' + '0' + '1' + packed[11];
    }
    else if(checker[0] == '1' && checker[1] == '0' && checker[2] == '0'){
        bcd = packed[9] + packed[10] + packed[3] + packed[5] + packed[6] + packed[7] + '1' + '1' + '0' + packed[11] 
    }
    else if(checker[0] == '0' && checker[1] == '1' && checker[2] == '1'){
        bcd = packed[1] + packed[2] + packed[3] + '1' + '0' + packed[7] + '1' + '1' + '1' + packed[11];
    }
    else if(checker[0] == '1' && checker[1] == '0' && checker[2] == '1'){
        bcd = packed[5] + packed[6] + packed[3] + '0' +'1' + packed[7] + '1' + '1' + '1' + packed[11];
    }
    else if(checker[0] == '1' && checker[1] == '1' && checker[2] == '0'){
        bcd = packed[9] + packed[10] + packed[3] + '0' + '0' + packed[7] + '1' + '1' + '1' + packed[11];
    }
    else if(checker[0] == '1' && checker[1] == '1' && checker[2] == '1'){
        bcd = '0' + '0' + packed[3] + '1' + '1' + packed[7] + '1' + '1' + '1' + packed[11];
    }
  
    
    return bcd;
}
/*Runs main loop to convert INT into a densely packed BCD
Param: (Int) number to be converted to densely packed BCD
Return: Densely packed BCD*/
function densely_fixer(decimal){
    bcd ='';
    str1 = '';
    sNum = decimal.toString()
    
    while(sNum.length % 3 != 0){
        sNum = '0' + temp;
    }
    
    for(i = 0; i + 3 <= sNum.length;i= i + 3){
 
       
        var tempString = sNum[i]+ sNum[i+1] + sNum[i+2];
 
        var temp = densely_packed(packed_bcd(parseInt(tempString)));
        str1 = str1.concat(temp);
        bcd = bcd + ' ' + str1;
        str1 = '' ;
    }
    return bcd;
}
function combination_field(exp,sigMSD){
    
    
    var sigbin = unsigned_binary(sigMSD);
    var combifield;
    while(sigbin.length < 4){
        sigbin = '0' + sigbin;
    }
    while(exp.length % 4 != 0){
        exp = '0' + exp;
    }
    console.log(sigMSD);
    if(sigbin[0] == '0'){
        combifield = exp[0] + exp[1] + sigbin[1] + sigbin[2] + sigbin[3]; 
    }
    else if(sigbin[0] == '1' && sigbin[1] == '0' && sigbin[2] == '0'){
        combifield = '1' + '1' + exp[0] + exp[1] + sigbin[3];
    }
    if(combifield == "11110"){
        return "Infinity";
    }
    if(combifield == "11111"){
        return "NaN";
    }
    return combifield;
}
