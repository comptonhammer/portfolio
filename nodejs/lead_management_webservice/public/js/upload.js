if(document.readyState == 'loading') document.addEventListener('DOMContentLoaded', listen);
else listen();

function listen(){
    const fileInput = document.getElementsByClassName('custom-file-input');
    console.log(fileInput);
    for(let i = 0; i < fileInput.length; i++){
        fileInput[i].addEventListener('onchange', (e) => {
            let fileName = fileInput[i].value.split('\\').pop();

            console.log(fileName);
            let label = fileInput[i].nextSibling;
            console.log(label);
            label.classList.add('selected');
            label.innerHTML = fileName;
        })
    }
}

function getSiblings(elem){
    let siblings = [];
    let sibling = elem.parentNode.firstChild;

    while(sibling){
        if(sibling.nodeType === 1 && sibling != elem){
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }

    return sibling;
}

function getSiblingByClass(elem, className){
    let siblings = getSiblings(elem);
    for(let i = 0; i < siblings.length; i++)
        if(siblings[i].className === className) return siblings[i];
    return false;
}