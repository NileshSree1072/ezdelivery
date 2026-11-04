import Center from "@/components/Center";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductsGrid from "@/components/ProductsGrid";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { Category } from "@/models/Category";
import Product from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {border, ink, muted, primary} from "@/lib/colors";

const CategoryHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px 24px;
  margin-bottom: 20px;
  h1{
    margin-bottom: 0;
  }
  p{
    margin: 4px 0 0;
    color: ${muted};
  }
`;

const FiltersWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Filter = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: #fff;
  border: 1px solid ${border};
  border-radius: 10px;
  color: ${muted};
  font-size: 14px;
  select{
    background-color: transparent;
    border: 0;
    font-size: 14px;
    font-weight: 600;
    color: ${ink};
    cursor: pointer;
  }
  &:focus-within{
    border-color: ${primary};
  }
`;

const Empty = styled.div`
  padding: 40px 16px;
  text-align: center;
  background-color: #fff;
  border: 1px solid ${border};
  border-radius: 14px;
  color: ${muted};
  a{ font-weight: 600; }
`;

export default function CategoryPage({
  category,subCategories,products:originalProducts
}) {
  const defaultSorting = '_id-desc';
  const defaultFilterValues = category.properties.map(p => ({name:p.name,value:'all'}));
  const [products,setProducts] = useState(originalProducts);
  const [filtersValues,setFiltersValues] = useState(defaultFilterValues);
  const [sort,setSort] = useState(defaultSorting);
  const [loadingProducts,setLoadingProducts] = useState(false);
  const [filtersChanged,setFiltersChanged] = useState(false);

  function handleFilterChange(filterName,filterValue){
    setFiltersValues(prev=>{
      return prev.map(p=>({
        name:p.name,
        value:p.name === filterName ? filterValue : p.value,
      }));
    });
    setFiltersChanged(true);
  }
  useEffect(()=>{
    if(!filtersChanged){
      return;
    }
    setLoadingProducts(true);
    const catIds = [category._id, ...(subCategories?.map(c=>c._id) || [])];
    const params = new URLSearchParams();
    params.set('categories',catIds.join(','));
    params.set('sort',sort);
    filtersValues.forEach(f=>{
      if(f.value !== 'all'){
        params.set(f.name,f.value);
      }
    });
    const url = `/api/products?` + params.toString();
    axios.get(url).then(res=>{
      setProducts(res.data);
      setTimeout(()=>{
        setLoadingProducts(false);
      },500);
    });
  },[filtersValues,sort,filtersChanged]);
  return (
    <>
      <Header />
      <main>
        <Center>
          <CategoryHeader>
            <div>
              <Title>{category.name}</Title>
              <p>{products.length} {products.length === 1 ? 'product' : 'products'}</p>
            </div>
            <FiltersWrapper>
              {category.properties.map(prop => (
                <Filter key={prop.name}>
                  <span>{prop.name}:</span>
                  <select onChange={(ev)=>handleFilterChange(prop.name, ev.target.value)}
                          value={filtersValues.find(f=>f.name===prop.name).value}>
                    <option value="all">All</option>
                    {prop.values.map(val => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                </Filter>
              ))}
              <Filter>
                <span>Sort:</span>
                <select value={sort}
                        onChange={ev => {
                          setSort(ev.target.value);
                          setFiltersChanged(true);
                        }}>
                  <option value="_id-desc">Newest first</option>
                  <option value="_id-asc">Oldest first</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                </select>
              </Filter>
            </FiltersWrapper>
          </CategoryHeader>
          {loadingProducts && (
            <Spinner fullWidth/>
          )}
          {!loadingProducts && (
            <div>
              {products.length > 0 && (
                <ProductsGrid products={products}/>
              )}
              {products.length === 0 && (
                <Empty>
                  No products match these filters. <Link href="/products">See all products</Link>
                </Empty>
              )}
            </div>
          )}
        </Center>
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const category = await Category.findById(context.query.id);
  const subCategories = await Category.find({parent:category._id});
  const catIds = [category._id, ...subCategories.map(c=>c._id)];
  const products = await Product.find({category:catIds}, null, {sort: {_id: -1}});
  return {
    props:{
      category:JSON.parse(JSON.stringify(category)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      products:JSON.parse(JSON.stringify(products)),
    }
  };
}
