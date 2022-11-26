//sudoku içinde oluşacak sayıların adedini constan içerisinden size ile newGrid içerisine çağırıp 
//seviyelere göre grid  yeni grid oluturacağız inş:)
const newGrid= (size)=>{
let arr =new Array(size);


for(let i=0 ; i < size;i++){
    arr[i]=new Array(size);
}
for(let i=0;i<Math.pow(size,2);i++){
    arr[Math.floor(i/size)][i%size]=CONSTANT.UNASSIGNED;//şimdi atama yaptık.
}

return arr;

}

//Sutundaki yeni sayıyı kontrol et  Burada Value dışarıdan gelen değer.
const isColExist =(grid,col,value)=>{
    for (let row=0;row<CONSTANT.GRID_SIZE;row++){
        if(grid[row][col]===value) return false;
    }
    return true;
}

//satırdaki yeni sayıyı kontrol et
const isRowExist =(grid,row,value)=>{
    for (let col=0;col<CONSTANT.GRID_SIZE;col++){
        if(grid[row][col]===value) return false;
    }
    return true;
}

//3x3 karde kontol
const isBoxExist =(grid,box_row,box_col,value)=>{ 
   for(let row=0;row<CONSTANT.BOX_SIZE;row++){
       for(let col=0;col<CONSTANT.BOX_SIZE;col++){
            if(grid[row+box_row][col+box_col] === value) return false;//ilk önce 1. boxa bakacak sonra arttırarak tüm karelere gidecek.
       }
       return true;
   }
}

//hep birlikte kontrol

const isExist=(grid,row,col,value) =>{
    return isColExist(grid,col,value) && isRowExist(grid,row,value) && isBoxExist(grid,row -row%3,col -col%3,value) && value!==CONSTANT.UNASSIGNED ;//
}


//oluşturulan hücrei bul
const findUnassigned = (grid,pos)=>{ //pos:position
    for(let row=0;row<CONSTANT.GRID_SIZE;row++){
        for(let col=0;col<CONSTANT.GRID_SIZE;col++){
             if(grid[row][col] === CONSTANT.UNASSIGNED) //ilk önce 1. boxa bakacak sonra arttırarak tüm karelere gidecek.
              {
                pos.row=row;
                pos.col=col;
                return true;
              }
        }
    }   
    return false;
}

// Oluşan diziyi karıştırma
const mixedArray=(arr) =>{
    let r_index=arr.length;

    while (r_index!==0){
        let rand_index=Math.floor(Math.random()*r_index);
        r_index=r_index-1;

        let x =arr[r_index];
        arr[r_index]=arr[rand_index];
        arr[rand_index]=x;
    }
    return arr;
}


//tamamlanıp tamamlanmadğını kontrol et
const isFullGrid =(grid)=>{
    return grid.every((row,i) => {
        return row.every((value,j)=>{//every ile tüm değerleri kontol edip bool değer döndürdük.
            return value!== CONSTANT.UNASSIGNED;
        });
    });
}

const sudokuCreate=(grid)=>{
    let unassigned_pos={
        row:-1,
        col:-1
    }
    if(!findUnassigned(grid,unassigned_pos)) return true;
 let number_list =mixedArray([...CONSTANT.NUMBERS]);//... ile hepsini seçmiş olduk
 
 let row =unassigned_pos.row;
 let col =unassigned_pos.col;

 number_list.forEach((num,i) => {
    if(isExist(grid,row,col,num)){
        grid[row][col]=num;

        if(isFullGrid(grid)){
            return true;
        }
        else{
            if(sudokuCreate(grid)){
                return true;
            }
        }
        grid[row][col] =CONSTANT.UNASSIGNED;
    }
    
 });
 return isFullGrid(grid);
}

const sudokuCheck=(grid)=>{
    let unassigned_pos = {
        row: -1,
        col: -1
    }

    if (!findUnassigned(grid, unassigned_pos)) return true;

    grid.forEach((row, i) => {
        row.forEach((num, j) => {
            if (isExist(grid, i, j, num)) {
                if (isFullGrid(grid)) {
                    return true;
                } else {
                    if (sudokuCreate(grid)) {
                        return true;
                    }
                }
            }
        })
    })

    return isFullGrid(grid);
}

const rand=()=>Math.floor(Math.random()*CONSTANT.GRID_SIZE);

const removeCells =(grid,level)=>{
    let rs=[...grid];
    let a_level=level;
    while(a_level>0){
        let row=rand();
        let col=rand();
        while(rs[row][col]===0){
            row=rand();
            col=rand();
        }
        rs[row][col] =CONSTANT.UNASSIGNED;
        a_level--;
    }
    return rs;
}

//seviyelerdeki temel sudoku oluşması
const sudokuGeneration=(level)=>{
    let sudoku =newGrid(CONSTANT.GRID_SIZE);
    let create= sudokuCreate(sudoku);
    if(create){
        let question =removeCells(sudoku,level);
        return{     
            original:sudoku,
            question:question
        }

    }
    return undefined;
}
