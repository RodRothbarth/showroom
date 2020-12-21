$(document).ready(function(){
    $(".dt_birth").mask('00/00/0000');
    $(".phone").mask('(00) 00000-0000');
})

let dataSaler = [];
let carDataBase = [];

function Saler(name, id, dtBirth, email, phone, password, idSaler){
    this.name = name,
    this.id = id,
    this.dtBirth = dtBirth,
    this.email = email,
    this.phone = phone,
    this.password = password,
    this.idSaler = idSaler
};

function SalerForm(){//cria o objeto a ser utilizado no cadastro
    let user = Array.from(document.getElementsByName("seler_registration")).map(function(element){return element.value;}); 
    let form = new User(user[0], user[1], user[2], user[4], user[5], user[6]);
        return form; 
};

function RegisterSaler(){ //sistema para cadastrar um novo usuario.
    let user = SalerForm();
    let exists;
     
    if (localStorage.getItem("user") === null ){
        dataSaler.push(user);
        localStorage.setItem("user", JSON.stringify(dataSaler));
        alert("Registration Done!");
    }else{
        dataSaler = JSON.parse(localStorage.getItem("user"));
        for(let i=0;i<dataSaler.length;i++){
           exists = dataSaler[i].id.includes(user.id)  
        };
        if(exists === true){
            alert("Saler already in register")
        }else{
            dataSaler.push(user);
            localStorage.setItem("user", JSON.stringify(dataSaler));
            alert("Registration Done!");
        };   
    };        
};
//function to check if passwords are the same for checking pourposes
function ValidPass(){
    let pass1 = document.getElementById("password").value;
    let pass2 = document.getElementById("password_confirmation").value;
    if(pass1 !== pass2){
        alert("Password fields must be equal!");
    };
};

//function to validade the idnumber using its validation numbers.
function Idcheck(strCPF) {
    var sum = 0;
    var remainder;
    
    if (strCPF == "00000000000") return false;

    for (i=1; i<=9; i++) sum = sum + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    remainder = (sum * 10) % 11;

    if ((remainder == 10) || (remainder == 11))  remainder = 0;
    if (remainder != parseInt(strCPF.substring(9, 10)) ) return false;

    sum = 0;
    for (i = 1; i <= 10; i++) sum = sum + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    remainder = (sum * 10) % 11;

    if ((remainder == 10) || (remainder == 11))  remainder = 0;
    if (remainder != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;    
};

//function used to validade in Form the authenticity of the Id number (true/false)
function ValidId(){
    var strCPF = document.getElementById("cpf").value;
    strCPF = strCPF.replace(".", ""); //excludes any simbol from dialing
    strCPF = strCPF.replace(/[^\d]+/g,'');
    TestaCPF(strCPF);
    if (TestaCPF(strCPF) !== true) {
        alert("You have used an Invalid CPF number!");
        strCPF = ''
    }; 
};

// function to check the saler to grant access to the data base
function Validation(){
    dataSaler = JSON.parse(localStorage.getItem('user'));
    let usern = document.getElementById("login_id").value;
    let pssw = document.getElementById("login_password").value;

    for(let i = 0; i < dataSaler.length; i++){
        dataSaler[i].id = dataSaler.indexOf(dataSaler[i])
        localStorage.setItem("user", JSON.stringify(dataSaler));
        if(dataSaler[i].id === usern){
            if(dataSaler[i].password === pssw){
                localStorage.setItem("online", JSON.stringify(dataSaler[i]));
                location.href="car_showroom.html";
            }else{
                alert("Invalid Password!");
            };
            break;
        }else{
            alert("Invalid Login!");
        };
    };
};


//constructor function to register car Form info.
function Car(brand, model, name, factoryYr, color, price, idCar){
    this.brand = brand,
    this.model = model,
    this.name = name,
    this.factoryYr = factoryYr,
    this.color = color,
    this.price = price,
    this.idCar = idCar
};

function CarForm(){ //constroi o objeto para utilizar na criação da tabela e armazenamento dos certificados no localStorage
    let carData = Array.from(document.getElementsByName("car_registration")).map(function(element){
        return element.value;});
    let form = new Car(carData[0], carData[1], carData[2], carData[3], carData[4], carData[5], carData[6]);
    return form; 
};

function CarRegistration(){
    let car = CarForm();
    if (localStorage.getItem('car') === null){ //se o localStorage nao existir, cria-se um
        carDataBase.push(car)
        localStorage.setItem('car', JSON.stringify(carDataBase));   
        alert("Car registration Done!");    
    }else{ //se ele existir, recupera a informação e adiciona a nova
        carDataBase = JSON.parse(localStorage.getItem('car')); 
        carDataBase.push(car) ;
        localStorage.setItem('car', JSON.stringify(carDataBase));   
        alert("Car registration Done!");
    };              
};

//transforms localStoge incoming data into array for table usage.
function getDataCar(){ 
    JSON.parse(localStorage.getItem("car")).forEach(function(info){ 
        carDataBase.push((info))
    });
    return carDataBase;
}

//to order the table by disirable atribute 
$('#car-table').on('click', function(){ 
    let column = $(this).data('column');
    let order = $(this).data('order');

    if(order == 'decr'){
        $(this).data('ordem', "cresc");
        carDataBase = carDataBase.sort((a,b) => a[column]>b[column] ? 1 : -1);
    }else{
        $(this).data('ordem', "decr");
        carDataBase = carDataBase.sort((a,b) => a[column]<b[column] ? 1 : -1);
    }  
    Criatabela(carDataBase);
});

//function to create a table to show car data information 
function CarTable(data){ 
    let table = document.getElementById("car_table");
    table.innerHTML = "";
    for(var i=0; i< data.length; i++){
        data[i].id = `${i}`;
    
       var row = `<tr class="row-${data[i].id}"> 
                        <td name='row-${data[i].id}' data-id="${data[i].id}" >${data[i].brand}</td> 
                        <td name='row-${data[i].id}' data-id="${data[i].id}" >${data[i].model}</td> 
                        <td name='row-${data[i].id}' data-id="${data[i].id}" >${data[i].name}</td>  
                        <td name='row-${data[i].id}' data-id="${data[i].id}" >${data[i].factoryYr}</td> 
                        <td name='row-${data[i].id}' data-id="${data[i].id}" >${data[i].color}</td> 
                        <td name='row-${data[i].id}' data-id="${data[i].id}" >${data[i].price}</td> 
                        <td name='row-${data[i].id}' data-id="${data[i].id}" >${data[i].idCar}</td> 
                        <td>
                            <img id="edit-${data[i].id}" src='imagens/edit.png' style="padding-left: 10px;" class='' data-id="${data[i].id}">
                            <img id="delete-${data[i].id}"  src='imagens/lixo.png' style="padding-left: 10px;" class='' data-id="${data[i].id}">
                            <img id="confirm-${data[i].id}"  src='imagens/certo.png' style="padding-left: 10px;" class='hidden' data-id="${data[i].id}"> 
                            <img id="cancel-${data[i].id}"  src='imagens/errado.png' style="padding-left: 10px;" class='hidden' data-id="${data[i].id}">    
                            <img id="cancEdit-${data[i].id}"  src='imagens/errado.png' style="padding-left: 10px;" class='hidden' data-id="${data[i].id}">    
                            <img id="confirmEdit-${data[i].id}" src='imagens/certo.png' style="padding-left: 10px;" class='hidden' data-id="${data[i].id}">  
                        </td> 
                         
                   </tr>`;
        $('#tabelaCertificados').append(row);
        
        $(`#delete-${data[i].id}`).on('click', DeleteCar);
        $(`#edit-${data[i].id}`).on('click', EditCar);
        $(`#confirm-${data[i].id}`).on('click', ConfirmDel);
        $(`#cancel-${data[i].id}`).on('click', CancelDel);
        $(`#cancEdit-${data[i].id}`).on('click', CancelEdit);
        $(`#confirmEdit-${data[i].id}`).on('click', ConfirmEdit);
    };
};

function EditCar(){ //abre a row de edição para os certificados 
    let idRow = $(this).data('id');
    let edit = $(`#edit-${idRow}`);
    let del = $(`#delete-${idRow}`);
    let cancel = $(`#cancEdit-${idRow}`);
    let save = $(`#confirmEdit-${idRow}`);
    let brand = carDataBase[`${idRow}`].brand;
    let model = carDataBase[`${idRow}`].model;
    let name = carDataBase[`${idRow}`].name;
    let factoryYr = carDataBase[`${idRow}`].factoryYr;
    let color = carDataBase[`${idRow}`].color;
    let price = carDataBase[`${idRow}`].price;
     
    $(this).parents('tr').find(`td:eq(0)`).html(`<input id='cpf-${idRow}' type="text" value="${brand}" >`);
    $(this).parents('tr').find(`td:eq(1)`).html(`<input id='evento-${idRow}' type="text" value="${model}" >`);
    $(this).parents('tr').find(`td:eq(2)`).html(`<input id='dataI-${idRow}'  type="text" value="${name}" >`);
    $(this).parents('tr').find(`td:eq(3)`).html(`<input id='dataF-${idRow}' type="number" value="${factoryYr}" >`);
    $(this).parents('tr').find(`td:eq(4)`).html(`<input id='horas-${idRow}' type="text" value="${color}" >`);
    $(this).parents('tr').find(`td:eq(5)`).html(`<input id='tipo-${idRow}' type="number" value="${price}" >`);
    
    edit.addClass('hidden')
    del.addClass('hidden')
    cancel.removeClass('hidden')
    save.removeClass('hidden')
}

function ConfirmEdit(){//confirma a edição feita nas linhas da table
    let idRow = $(this).data('id');
    let edit = $(`#edit-${idRow}`);
    let del = $(`#delete-${idRow}`);
    let cancel = $(`#cancEdit-${idRow}`);
    let save = $(`#confirmEdit-${idRow}`);
        
    let brand =  document.getElementById(`cpf-${idRow}`).value
    let model =  document.getElementById(`evento-${idRow}`).value
    let name =  document.getElementById(`dataI-${idRow}`).value
    let factoryYr =  document.getElementById(`dataF-${idRow}`).value
    let color =  document.getElementById(`horas-${idRow}`).value
    let price =  document.getElementById(`tipo-${idRow}`).value

    carDataBase[`${idRow}`].brand = brand
    carDataBase[`${idRow}`].model = model
    carDataBase[`${idRow}`].name = name
    carDataBase[`${idRow}`].factoryYr = factoryYr
    carDataBase[`${idRow}`].color = color
    carDataBase[`${idRow}`].price = price

    localStorage.setItem('car', JSON.stringify(carDataBase))
    edit.removeClass('hidden');
    del.removeClass('hidden');
    cancel.addClass('hidden');
    save.addClass('hidden');
    location.reload();
}

function CancelEdit(){ //cancela a opção de edição
    let idRow = $(this).data('id');
    let edit = $(`#edit-${idRow}`);
    let del = $(`#delete-${idRow}`);
    let cancel = $(`#cancEdit-${idRow}`);
    let save = $(`#confirmEdit-${idRow}`);
    
    edit.removeClass('hidden');
    del.removeClass('hidden');
    cancel.addClass('hidden');
    save.addClass('hidden');
    location.reload();
}

function DeleteCar(){ // ldeleta as informação do certificado desejado
    let idRow = $(this).data('id');
    let edit = $(`#edit-${idRow}`);
    let del = $(`#delete-${idRow}`);
    let cancel = $(`#cancEdit-${idRow}`);
    let save = $(`#confirmEdit-${idRow}`);

    edit.addClass('hidden');
    del.addClass('hidden');
    cancel.removeClass('hidden');
    save.removeClass('hidden');   
}

function ConfirmDel(){ // confirma a deleção do item da tabela
    let idRow = $(this).data("id")
    let row = $(`.linha-${idRow}`)
    
    carDataBase.splice(`${idRow}`,1)
    localStorage.setItem('car', JSON.stringify(carDataBase))  
    row.remove()
}

function CancelDel(){ // cancela a atribuição de deleção do item da tabela
    let idRow = $(this).data('id');
    let edit = $(`#edit-${idRow}`);
    let del = $(`#delete-${idRow}`);
    let cancel = $(`#cancEdit-${idRow}`);
    let save = $(`#confirmEdit-${idRow}`);
    
    edit.removeClass('hidden')
    del.removeClass('hidden')
    cancel.addClass('hidden')
    save.addClass('hidden')  
}

