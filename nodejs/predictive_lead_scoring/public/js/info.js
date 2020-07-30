window.onload = function() {
    let type = $('#type').attr('value');
    let fullName = $('#name').attr('value');
    let fName = fullName.split(' ')[0];
    let lName = fullName.split(' ')[1];
    let address = $('#address').attr('value');
    let phone = $('#phone').attr('value');
    let city = $('#city').attr('value');
    let state = $('#state').attr('value');
    let zip = $('#zip').attr('value');

    const query = `fName=${fName}&lName=${lName}&address=${address}&phone=${phone}&city=${city}&state=${state}&zip=${zip}`;
    
    if(type == 'all'){
        const url = `/lead/juju/ext-data?${query}`;
        $.post(url, i =>{
            if(i.err){
                errorHandler(i);
            }
            else{
                magHundred = (i.leadMagnitude / i.mag) * 100;

                if (magHundred >= 100){
                    magHundred -= 100;
                    document.
                    
                    ElementById('mag-det').innerHTML = parseFloat(magHundred).toFixed(2)+'% ABOVE';
                    document.getElementById('mag-perc-pos').style.width = '' + Math.abs(parseFloat(magHundred).toFixed(2)) + '%';
                    document.getElementById('mag-perc-pos-text').innerHTML = '' + Math.abs(parseFloat(magHundred).toFixed(2))+'%';
                }
                else if (magHundred < 100){
                    magHundred -= 100;
                    document.getElementById('mag-det').innerHTML = Math.abs(parseFloat(magHundred).toFixed(2))+'% BELOW';
                    document.getElementById('mag-perc-neg').style.width = Math.abs(parseFloat(magHundred).toFixed(2))+'%';
                    document.getElementById('mag-perc-neg-text').innerHTML = parseFloat(magHundred).toFixed(2)+'%';
                }
                else if(i == 'noMatch'){
                    document.getElementById('status-div').style.display = 'none';
                    document.getElementById('error-occured').style.display = 'table';
                }

                leadHundred = i.leadPercent * 100;
                document.getElementById('lead-perc').style.width = '' + Math.abs(parseFloat(leadHundred).toFixed(2))+'%';
                document.getElementById('lead-perc').innerHTML = '' + Math.abs(parseFloat(leadHundred).toFixed(2))+'%';
                document.getElementById('lead-det').innerHTML = Math.abs(parseFloat(leadHundred).toFixed(2))+'%';
                document.getElementById('full-body').style.display = '';
                document.getElementById('status-div').style.display = 'none';
                document.getElementById('cherries').innerHTML = getRating(i.leadPercent, magHundred/100);
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
        const url = `/lead/juju?${query}`;
        $.post(url ,(i) =>{
            if(i.err){
                errorHandler(i);
            }
            else{
                magHundred = (i.leadMagnitude / i.mag) * 100;

                if (magHundred >= 100){
                    magHundred -= 100;
                    document.getElementById('mag-det').innerHTML = parseFloat(magHundred).toFixed(2)+'% ABOVE';
                    document.getElementById('mag-perc-pos').style.width = '' + Math.abs(parseFloat(magHundred).toFixed(2)) + '%';
                    document.getElementById('mag-perc-pos-text').innerHTML = '' + Math.abs(parseFloat(magHundred).toFixed(2))+'%';
                }
                else if (magHundred < 100){
                    magHundred -= 100;
                    document.getElementById('mag-det').innerHTML = Math.abs(parseFloat(magHundred).toFixed(2))+'% BELOW';
                    document.getElementById('mag-perc-neg').style.width = Math.abs(parseFloat(magHundred).toFixed(2))+'%';
                    document.getElementById('mag-perc-neg-text').innerHTML = parseFloat(magHundred).toFixed(2)+'%';
                }
                else if(i == 'noMatch'){
                    document.getElementById('status-div').style.display = 'none';
                    document.getElementById('error-occured').style.display = 'table';
                }

                leadHundred = i.leadPercent * 100;
                document.getElementById('lead-perc').style.width = '' + Math.abs(parseFloat(leadHundred).toFixed(2))+'%';
                document.getElementById('lead-perc').innerHTML = '' + Math.abs(parseFloat(leadHundred).toFixed(2))+'%';
                document.getElementById('lead-det').innerHTML = Math.abs(parseFloat(leadHundred).toFixed(2))+'%';
                document.getElementById('full-body').style.display = '';
                document.getElementById('status-div').style.display = 'none';
                document.getElementById('cherries').innerHTML = getCherries(i.leadPercent, magHundred/100);
                let mv = i.marketValue;
                if (mv == 0) mv = 'Not Available';

                document.getElementById("output").value = 'Projected Magnitude From Avg,' + magHundred.toFixed(2) + '%\n' + 'Projected Success,' + leadHundred.toFixed(2) + '%\n'
                    + 'Name,' + fullName + '\n' + 'Address,' + address + '\n'
                    + 'Phone,' + phone + '\n' + 'City,' + city + '\n' + 'State,' + state + '\n' + 'Zip,' + zip + '\n';
            }
        })
    }
    else if(type =='extendedData'){
        const url = `/lead/ext-data?${query}`;
        $.post(url, i =>{
            if(i.err){
                errorHandler(i);
            }
            else{
                document.getElementById('full-body').style.display = '';
                document.getElementById('status-div').style.display = 'none';
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
        document.getElementById('status-div').style.display = 'none';
        document.getElementById('error-occured').style.display = 'table';
        document.getElementById('error-text').innerHTML = 'There was an error with the machine learning code.'
    }
    else if(i.errMsg == 'throttled'){
        document.getElementById('status-div').style.display = 'none';
        document.getElementById('throttle-limit-reached').style.display = 'table';
    }
    else if(i.errMsg == 'accountNA'){
        document.getElementById('status-div').style.display = 'none';
        document.getElementById('error-account').style.display = 'table';
    }
    else if(i.errMsg == 'invalidDate'){
        document.getElementById('status-div').style.display = 'none';
        document.getElementById('invalid-date').style.display = 'table';
    }
    else if(i.errMsg == 'noMatch'){
        document.getElementById('status-div').style.display = 'none';
        document.getElementById('error-occured').style.display = 'table';
    }
    else{
        document.getElementById('status-div').style.display = 'none';
        document.getElementById('error-occured').style.display = 'table';
        document.getElementById('error-text').innerHTML = i.errMsg;
    }
}

$(() => {
    $("#back-btn").click(e => {
        e.preventDefault();
        window.location.replace('/home');
        document.getElementById('list').style.backgroundColor = "red";
        return false;
    });

    $("#download-lead").click(e => { //creates and downloads a spreadsheet
        e.preventDefault();
        
        const fullName = $('#name').attr('value').replace(' ', '');
        let text = document.getElementById("output").value;
        
        text = text.replace(/\n/g, "\r\n"); // To retain \n newline
        
        let blob = new Blob([text], { type: "text/csv"});
        let anchor = document.createElement("a");
        
        anchor.download = `LeadJuJu-${fullName}.csv`;
        anchor.href = window.URL.createObjectURL(blob);
        anchor.target ="_blank";
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    });
});

function getRating(leadScore, magnitude){
    let newString = '';
    const weight = .85;
    const tenth = weight / 10;

    const weighted = magnitude * weight;
    const rating = ((leadScore * 2) + weighted) / 2;

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
