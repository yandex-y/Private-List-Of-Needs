//VARIABEL
const input_container = document.querySelector('.input-container'),
      input_tag = document.getElementById('input-tag'),
      input_price = document.getElementById('input-price'),
      btn_add_tag = document.getElementById('btn-add-tag'),
      btn_add_price = document.getElementById('btn-add-price'),
      list_item_box = document.querySelector('.list-item-box'),
      btn_add_item = document.querySelector('.add-item i'),
      input_box = document.querySelector('.input-box'),
      chek_setting = document.getElementById('checkbox-setting'),
      setting_container = document.querySelector('.settings-container'),
      delete_all_items = document.getElementById('delete_all_items');


//EVENT LISTENER
delete_all_items.addEventListener('click', func_delete_all_items);
btn_add_item.addEventListener('click', () => {
    showInputTag(null,true)
});
chek_setting.addEventListener('click', settingsContainerToggle);
input_container.addEventListener('click', () => {
    input_container.style.display = 'none';
    input_box.style.display = 'none'
})


//CALL FUNCTION
emptyLocalStorage()
add_element();


//FUNCTION
function emptyLocalStorage(){
    if(localStorage.getItem('expenditure') === null){
        localStorage.setItem('expenditure','[]')
    }
}

function addElements(e,i,div3){
    
    const li = document.createElement('li'),
    div1 = document.createElement('div'),
    div2 = document.createElement('div'),
    p1 = document.createElement('p'),
    ol = document.createElement('ol'),
    i1 = document.createElement('i'),
    i2 = document.createElement('i'),
    i3 = document.createElement('i'),
    li1 = document.createElement('li'),
    li2 = document.createElement('li'),
    txt_name = document.createTextNode(e.item_name),
    txt_price = document.createTextNode(addPointInPrice(e.item_price)),
    txt_priority = document.createTextNode(`PRIORITY : ${e.priority}`),
    i1Inner = document.createTextNode(`Hapus`),
    i2Inner = document.createTextNode(`Edit`),
    i3Inner = document.createTextNode(`Tambah`),

    elementIndex = [div3,li,li,div1,p1,div2,div2,div2,ol,ol,li1,li2,i1,i2,i3,div1],
    elementNode = [li,div1,div2,p1,txt_name,i1,i2,i3,li1,li2,txt_price,txt_priority,i1Inner,i2Inner,i3Inner,ol];
    
    let num = 0
    for (element of elementIndex){
        element.appendChild(elementNode[num])
        num++
    }

    li.className = 'item';
    div1.className = 'nameNprice-container';
    div2.className = 'set-item';

    setItem_eventListener(i1,i2,i3,e,i)
}

function totalItemDisplay(){
    let p = document.createElement('p'),text;
   
    if(database().length == 0){text = document.createTextNode(`Tidak Ada Data, Klik Icon + Untuk Menambahkan`)}
    else{text = document.createTextNode(`${database().length} Items`)}

    p.className = 'total-items';
    
    p.appendChild(text);
    list_item_box.appendChild(p);
}

function totalPriceDisplay(){
    if(total_harga_all_items() > 0){
        const p = document.createElement('p'),
        txt = document.createTextNode(`Total Harga Semua Items = ${addPointInPrice(total_harga_all_items())}`);
    
        p.className = 'total-items';
    
        p.appendChild(txt);
        list_item_box.appendChild(p);
    }
}

function add_element(){
    list_item_box.innerHTML = null
    emptyLocalStorage();
    totalItemDisplay()
    const div3 = document.createElement('div');
    div3.className = 'list-items';
    list_item_box.appendChild(div3);
    totalPriceDisplay();
    
    const new_database = database().sort((a,b) => {
        return b.priority - a.priority
    })

    new_database.forEach((e,i) => {
        addElements(e,i,div3)
    })
}

function addPointInPrice(price){
    const tostr = price.toString();
    const toArr = tostr.split("").reverse();

    let newArr = [];
    toArr.forEach((e,i) => {
        if(i != 0 && i % 3 === 0){
            newArr.push('.')
        }
        newArr.push(e)
    })
    return newArr.reverse().join("")
    };
    
function func_delete_all_items(){
    if(confirm('Apakah Kamu Yakin Akan Menghapus Semua Item?')){
        localStorage.removeItem('expenditure');
        location.reload();
    }
}

function addItem(){
    let data = database()
    data.push({item_name: input_tag.value ,item_price: input_price.value,priority: 0,time: priorityInterval()});
    setItem(data)
}

function edit_data(i){
    let data = database();
    data.splice(i,1,{item_name: input_tag.value ,item_price: input_price.value,priority: data[i].priority,time: data[i].time});
    setItem(data)
}

function delete_item(i){
    if(confirm('anda Yakin Ingin Menghapus Item Ini!!!')){
        let data = database();
        data.splice(i,1)
        setItem(data)
        add_element()
    }
    
}

function add_priority(i){
    if(confirm('Apakah Kamu Yakin Ingin Menambahkan 1 Priority Ke Item Ini!!!')){
        let data = database()
        data[i].priority += 1;
        data[i].time = priorityInterval();
        setItem(data)
        add_element();
    }
}

function priorityInterval(){
    return new Date().getTime() + 94608000; //Wait 26 Jam 17 Menit
}

function showInputTag(i,sumber){
    let source = sumber;
    
    input_box.style.display = 'flex';
    input_container.style.display = 'block';
    
    if(source){
        input_tag.value = null
        input_price.value = null
    }else{
        input_tag.value = database()[i].item_name;
        input_price.value = database()[i].item_price
    }
    
    input_tag.style.display = "inline-block";
    input_price.style.display = 'none';
    btn_add_tag.style.display = 'inline-block';
    btn_add_price.style.display = 'none';
    
    btn_add_tag.addEventListener('click', () => {
        let source = sumber;
        if(input_tag.value.trim().length !== 0){
        showInputPrice(i,source);
    }
    }); 
}

function showInputPrice(i,sumber){
    input_tag.style.display = "none";
    input_price.style.display = 'inline-block';
    btn_add_tag.style.display = 'none';
    btn_add_price.style.display = 'inline-block';

    btn_add_price.addEventListener('click', () => {
        let source = sumber,
        inputNone = input_price.value.trim().length !== 0;
        if(source == true && inputNone){
            addItem()
            location.reload();
        }else if(source == false & inputNone){
            edit_data(i)
            location.reload();
        }  
    })
}

function settingsContainerToggle(){
    if(chek_setting.checked){
        setting_container.style.display = 'flex';
    }else{
        setting_container.style.display = 'none';
    }
}

function database(){
    emptyLocalStorage()
    return JSON.parse(localStorage.getItem('expenditure'));
}

function setItem(data){
    localStorage.setItem('expenditure',JSON.stringify(data));
}

function total_harga_all_items(){
    let data = database();
    let harga = 0;
    data.forEach((e) => {
        harga += parseInt(e.item_price)
    })
    return harga
}
//Checkpoint
function setItem_eventListener(i1,i2,i3,e,i){

    i1.addEventListener('click',() => {
        delete_item(i)
    })
    i2.addEventListener('click',() => {
        showInputTag(i,false)
    })

    if(e.time >= new Date().getTime()){
        i3.style.background = 'gray';
        i3.addEventListener('click',() => {
            let jarakInHours = (new Date(database()[i].time) - new Date().getTime()) / 1000 / 60 / 60, //In Hours
            jam = Math.floor(jarakInHours),
            menit = Math.round((jarakInHours - Math.floor(jarakInHours)) * 60);

            jam === 0 ? jam = '' : jam = `${jam} Jam `;
            menit === 0 ? menit = '' : menit = `${menit} Jam `;
            alert(`Tunggu Sekitar ${jam}${menit}Lagi`)
        })
    }else{
        i3.addEventListener('click',() => {
            add_priority(i)
        })
    }
}