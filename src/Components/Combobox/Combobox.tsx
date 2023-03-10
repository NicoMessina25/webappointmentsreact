import { Dropdown } from 'primereact/dropdown'
import React, { useEffect, useRef, useState, useContext } from 'react';
import { appContext } from '../Context/appContext';
import {langContext} from '../Context/langContext';
import Loader from '../Loader/Loader';
import _ from "lodash";

function Combobox({label, getItems,list,params, value, showClear, setValue, className, optionLabel, placeholder, scrollHeight, error, caption, reLoadItemsValue, width,disable}:any) {
  const [items, setItems]:any = useState([]);
  const [isMoreData, setIsMoreData] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(0);
  const [previousReLoadItemsValue, setPreviousReLoadItemsValue] = useState(reLoadItemsValue);

  const dropdown:any = useRef(null);
  let filterTimeout:any = useRef(null)
  let pageSize = 50, itemSize = 46;
  scrollHeight = scrollHeight || 200
  const {languageId}:any = useContext(langContext);


  useEffect(()=>{    
    loadItems(false)
  },[page, filterValue]);

  useEffect(()=>{
  
   
    if(!_.isEqual(reLoadItemsValue, previousReLoadItemsValue)){
      setPreviousReLoadItemsValue(reLoadItemsValue);
      if (page !== 0)
        setPage(0)
      else {
        loadItems(true)
      }
    }
    

  },[reLoadItemsValue]);

  /* useEffect(()=>{
  
    if(value){
      if (page !== 0)
        setPage(0)
      else {
        loadItems(true)
      }
    }
    
  }, [value]) */

  /* useEffect(()=>{
    loadItems(false);
  }, [value]); */

 /*  useEffect(()=>{
    console.log(items, label);
  },[items]); */
  

  const loadingTemplate = () =>{
    return <Loader size={itemSize*2} strokeWidth={6} className={"primarySpinner"} />
  }

  function loadItems(reset:boolean){
    let _items;
    setIsLoadingData(true)
    getItems && getItems(filterValue,page*pageSize, pageSize, languageId,params).then((data:any)=>{
      
      setIsMoreData(data.length === pageSize);
      
      
      _items = [...data];

      if(!reset){
        if(value){
          let element = _items.find((i)=>i[optionLabel] === value[optionLabel])

          if(element){
            
            _items.splice(_items.indexOf(element), 1)
          }
        }
          

        if(page !== 0){
          _items = [...items, ..._items];
        }
      }

      let valueInItems = _items.find((i)=> _.isEqual(i,value));
  
      if(value && !valueInItems && !reset){
        setItems([value, ..._items]);
        
        

      } else if(reset) {        
        setItems(_items);
        !valueInItems && setValue(null);
        _items.length === 1 && setValue(_items[0]);
  
      } else {
        setItems(_items);
      }

      
      setIsLoadingData(false);
    }) 
    if(list){
      setItems(list)
      setIsLoadingData(false);
    }
  
  }

  function onScroll(e:any){  
    
    
    if(e.target.scrollHeight-e.target.scrollTop - scrollHeight <= 0 && isMoreData){
        setPage(page + 1);
    }

  }
  
  function onFilter(e:any){
    
    clearTimeout(filterTimeout.current);
    filterTimeout.current =  setTimeout(()=>{
      setPage(0) 
      setFilterValue(e.filter);     
    }, 500)
    
  }

  return (
    <div className={`inputContainer flexible--column ${className}`} style={{width:`${width}%`}}>
        {label && <p className='label inputLabel'>{label}</p>}
        <Dropdown 
          ref={dropdown} 
          value={value} 
          onChange={(e:any) => {
            setValue(e.value)
          }} 
          scrollHeight={`${scrollHeight}px`}  
          placeholder={placeholder} 
          filter 
          resetFilterOnHide
          onFilter={onFilter} 
          optionLabel={optionLabel}
          showClear={showClear} 
          options={items} 
          className={error && "p-invalid"} 
          disabled={disable}
          virtualScrollerOptions={{ lazy: false, 
            itemSize:itemSize, 
            onScroll: onScroll,
            loading: isLoadingData,
            loadingTemplate: loadingTemplate}}/>
        {caption && <p className={error? "caption-invalid":"caption"}>{caption}</p>}
        {/* <AutoComplete value={value} suggestions={filteredItems} completeMethod={searchItem} field={optionLabel} dropdown forceSelection onChange={(e) => setValue(e.value)} aria-label="Countries" dropdownAriaLabel="Select Country" /> */}
    </div>
    
  )
}

export default Combobox