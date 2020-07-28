window.onload = function() {
    var type = $('#type').attr('value');
    var fullName = $('#name').attr('value');
    var fName = fullName.split(' ')[0];
    var lName = fullName.split(' ')[1];
    var address = $('#address').attr('value');
    var phone = $('#phone').attr('value');
    var city = $('#city').attr('value');
    var state = $('#state').attr('value');
    var zip = $('#zip').attr('value');

    if(type == 'all'){
        $.post(`/lead/juju/ext-data?fName=${fName}&lName=${lName}&address=${address}&phone=${phone}&city=${city}&state=${state}&zip=${zip}`,(i) =>{
            if(i.err){
                errorHandler(i);
            }
            else{
                magHundred = (i.leadMagnitude / i.mag) * 100;

                if (magHundred >= 100){
                    magHundred -= 100;
                    document.getElementById('magDet').innerHTML = parseFloat(magHundred).toFixed(2)+'% ABOVE';
                    document.getElementById('magPercPos').style.width = '' + Math.abs(parseFloat(magHundred).toFixed(2)) + '%';
                    document.getElementById('magPercPosText').innerHTML = '' + Math.abs(parseFloat(magHundred).toFixed(2))+'%';
                }
                else if (magHundred < 100){
                    magHundred -= 100;
                    document.getElementById('magDet').innerHTML = Math.abs(parseFloat(magHundred).toFixed(2))+'% BELOW';
                    document.getElementById('magPercNeg').style.width = Math.abs(parseFloat(magHundred).toFixed(2))+'%';
                    document.getElementById('magPercNegText').innerHTML = parseFloat(magHundred).toFixed(2)+'%';
                }
                else if(i == 'noMatch'){
                    document.getElementById('statusDiv').style.display = 'none';
                    document.getElementById('errorOccured').style.display = 'table';
                }

                leadHundred = i.leadPercent * 100;
                document.getElementById('leadPerc').style.width = '' + Math.abs(parseFloat(leadHundred).toFixed(2))+'%';
                document.getElementById('leadPerc').innerHTML = '' + Math.abs(parseFloat(leadHundred).toFixed(2))+'%';
                document.getElementById('leadDet').innerHTML = Math.abs(parseFloat(leadHundred).toFixed(2))+'%';
                document.getElementById('fullBody').style.display = '';
                document.getElementById('statusDiv').style.display = 'none';
                document.getElementById('cherries').innerHTML = getCherries(i.leadPercent,magHundred/100);
                let mv = i.marketValue;
                if (mv == 0) mv = 'Not Available';
                i.mv = mv;
                displayDataHandler(i);

                document.getElementById("output").value = 'Projected Magnitude From Avg,' + magHundred.toFixed(2) + '%\n' + 'Projected Success,' + leadHundred.toFixed(2) + '%\n'
                    +  'Name,' + fullName + '\n' + 'Address,' + address + '\n'
                    + 'Phone,' + phone + '\n' + 'City,' + city + '\n' + 'State,' + state + '\n' + 'Zip,' + zip + '\n'
                    + 'Age,' + i.age + '\n' + 'Business Owner and Occupation,' + i.businessOwnerOccupation + '\n' 
                    + 'Marital Status,' + i.maritalStatus + '\n' + 'Education,' + i.education + '\n' 
                    + 'Political Party,' + i.politicalParty + '\n' + 'Employment Status,' + i.employmentStatus + '\n'
                    + 'Occupation,' + i.occupation + '\n' + 'Estimated Income,' + i.estimatedIncome + '\n' 
                    + 'Length of Residence,' + i.lengthOfResidence + '\n' + 'Home Market Value,' + mv + '\n'
                    + 'Children Present,' + i.childrenPresent + '\n' + 'Interests,' + i.Interests;
            }
        })
    }
    else if(type == 'onlyJuju'){
        $.post(`/lead/juju?fName=${fName}&lName=${lName}&address=${address}&phone=${phone}&city=${city}&state=${state}&zip=${zip}`,(i) =>{
            if(i.err){
                errorHandler(i);
            }
            else{
                magHundred = (i.leadMagnitude / i.mag) * 100;

                if (magHundred >= 100){
                    magHundred -= 100;
                    document.getElementById('magDet').innerHTML = parseFloat(magHundred).toFixed(2)+'% ABOVE';
                    document.getElementById('magPercPos').style.width = '' + Math.abs(parseFloat(magHundred).toFixed(2)) + '%';
                    document.getElementById('magPercPosText').innerHTML = '' + Math.abs(parseFloat(magHundred).toFixed(2))+'%';
                }
                else if (magHundred < 100){
                    magHundred -= 100;
                    document.getElementById('magDet').innerHTML = Math.abs(parseFloat(magHundred).toFixed(2))+'% BELOW';
                    document.getElementById('magPercNeg').style.width = Math.abs(parseFloat(magHundred).toFixed(2))+'%';
                    document.getElementById('magPercNegText').innerHTML = parseFloat(magHundred).toFixed(2)+'%';
                }
                else if(i == 'noMatch'){
                    document.getElementById('statusDiv').style.display = 'none';
                    document.getElementById('errorOccured').style.display = 'table';
                }

                leadHundred = i.leadPercent * 100;
                document.getElementById('leadPerc').style.width = '' + Math.abs(parseFloat(leadHundred).toFixed(2))+'%';
                document.getElementById('leadPerc').innerHTML = '' + Math.abs(parseFloat(leadHundred).toFixed(2))+'%';
                document.getElementById('leadDet').innerHTML = Math.abs(parseFloat(leadHundred).toFixed(2))+'%';
                document.getElementById('fullBody').style.display = '';
                document.getElementById('statusDiv').style.display = 'none';
                document.getElementById('cherries').innerHTML = getCherries(i.leadPercent,magHundred/100);
                let mv = i.marketValue;
                if (mv == 0) mv = 'Not Available';

                document.getElementById("output").value = 'Projected Magnitude From Avg,' + magHundred.toFixed(2) + '%\n' + 'Projected Success,' + leadHundred.toFixed(2) + '%\n'
                    + 'Name,' + fullName + '\n' + 'Address,' + address + '\n'
                    + 'Phone,' + phone + '\n' + 'City,' + city + '\n' + 'State,' + state + '\n' + 'Zip,' + zip + '\n';
            }
        })
    }
    else if(type =='extendedData'){
        $.post(`/lead/ext-data?fName=${fName}&lName=${lName}&address=${address}&phone=${phone}&city=${city}&state=${state}&zip=${zip}`,(i) =>{
            console.log(i);
            if(i.err){
                errorHandler(i);
            }
            else{
                document.getElementById('fullBody').style.display = '';
                document.getElementById('statusDiv').style.display = 'none';
                let mv = i.marketValue;
                if (mv == 0) mv = 'Not Available';
                i.mv = mv;
                displayDataHandler(i);

                document.getElementById("output").value = 'Name,' + fullName + '\n' + 'Address,' + address + '\n'
                    + 'Phone,' + phone + '\n' + 'City,' + city + '\n' + 'State,' + state + '\n' + 'Zip,' + zip + '\n'
                    + 'Age,' + i.age + '\n' + 'Business Owner and Occupation,' + i.businessOwnerOccupation + '\n' 
                    + 'Marital Status,' + i.maritalStatus + '\n' + 'Education,' + i.education + '\n' 
                    + 'Political Party,' + i.politicalParty + '\n' + 'Employment Status,' + i.employmentStatus + '\n'
                    + 'Occupation,' + i.occupation + '\n' + 'Estimated Income,' + i.estimatedIncome + '\n' 
                    + 'Length of Residence,' + i.lengthOfResidence + '\n' + 'Home Market Value,' + mv + '\n'
                    + 'Children Present,' + i.childrenPresent + '\n' + 'Interests,' + i.Interests;
                document.getElementById("output").value = document.getElementById("output").value.split('undefined').join('');
            }
        })
    }
};

function displayDataHandler(i){
    document.getElementById('age').innerHTML = i.age || '';
    document.getElementById('businessOwnerOccupation').innerHTML = i.businessOwnerOccupation || '';
    document.getElementById('maritalStatus').innerHTML = i.maritalStatus || '';
    document.getElementById('education').innerHTML = i.education || '';
    document.getElementById('occupation').innerHTML = i.occupation || '';
    document.getElementById('estimatedIncome').innerHTML = i.estimatedIncome || '';
    document.getElementById('lengthOfResidence').innerHTML = i.lengthOfResidence || '';
    document.getElementById('marketValue').innerHTML = i.mv || '';
    document.getElementById('employmentStatus').innerHTML = i.employmentStatus || '';
    document.getElementById('politicalParty').innerHTML = i.politicalParty || '';
    document.getElementById('childrenPresent').innerHTML = i.childrenPresent || '';
    document.getElementById('interests').innerHTML = i.Interests || '   ';
}

function errorHandler(i){
    if(i.errMsg == 'err'){
        document.getElementById('statusDiv').style.display = 'none';
        document.getElementById('errorOccured').style.display = 'table';
        document.getElementById('errorText').innerHTML = 'There was an error with the machine learning code.'
    }
    else if(i.errMsg == 'throttled'){
        document.getElementById('statusDiv').style.display = 'none';
        document.getElementById('throttleLimitReached').style.display = 'table';
    }
    else if(i.errMsg == 'accountNA'){
        document.getElementById('statusDiv').style.display = 'none';
        document.getElementById('errorAccount').style.display = 'table';
    }
    else if(i.errMsg == 'invalidDate'){
        document.getElementById('statusDiv').style.display = 'none';
        document.getElementById('invalidDate').style.display = 'table';
    }
    else if(i.errMsg == 'noMatch'){
        document.getElementById('statusDiv').style.display = 'none';
        document.getElementById('errorOccured').style.display = 'table';
    }
    else{
        document.getElementById('statusDiv').style.display = 'none';
        document.getElementById('errorOccured').style.display = 'table';
        document.getElementById('errorText').innerHTML = i.errMsg;
    }
}

$(function () {
    $("#backBtn").click(function (e) {
        e.preventDefault();
        window.location.replace('/home');
        document.getElementById('list').style.backgroundColor = "red";
        return false;
    });

    $("#downloadLead").click(function (e) {
        e.preventDefault();
        var fullName = $('#name').attr('value').replace(' ', '');
        var text = document.getElementById("output").value;
        text = text.replace(/\n/g, "\r\n"); // To retain \n
        var blob = new Blob([text], { type: "text/csv"});
        var anchor = document.createElement("a");
        anchor.download = `LeadJuJu-${fullName}.csv`;
        anchor.href = window.URL.createObjectURL(blob);
        anchor.target ="_blank";
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    });
});

function getCherries(leadScore, magnitude){
    var newString = '';
    var weight = .85;
    var tenth = weight/10;

    var weighted = (magnitude*weight);

    var rating = ((leadScore * 2) + weighted) / 2;

    if(rating >= 1.0){ 
        newString = '🔮🔮🔮🔮🔮';
        return newString;
    }
    else if(rating >= weight && rating < 1.0){ 
        newString = '🔮🔮🔮🔮½';
        return newString;
    }
    else if(rating >= tenth*9 && rating < weight){ 
        newString = '🔮🔮🔮🔮';
        return newString;
    }
    else if(rating >= tenth*8 && rating < tenth*9){ 
        newString = '🔮🔮🔮½';
        return newString;
    }
    else if(rating >= tenth*7 && rating < tenth*8){ 
        newString = '🔮🔮🔮';
        return newString;
    }
    else if(rating >= tenth*5 && rating < tenth*7){ 
        newString = '🔮🔮½';
        return newString;
    }
    else if(rating >= tenth*4 && rating < tenth*5){ 
        newString = '🔮🔮';
        return newString;
    }
    else if(rating >= tenth*3 && rating < tenth*4){ 
        newString = '🔮½';
        return newString;
    }
    else if(rating >= tenth*2 && rating < tenth*3){ 
        newString = '🔮';
        return newString;
    }
    else if(rating >= tenth && rating < tenth*2){ 
        newString = '½';
        return newString;
    }
    else{ 
        newString = '0 :(';
        return newString;
    }
}