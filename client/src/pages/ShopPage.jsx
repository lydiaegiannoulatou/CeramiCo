import React from "react";
// import axios from "axios";
// import { useState } from "react";

function Shop() {
//   const [products, setProducts] = UseState([]);


// //_____retrieve products
//   async function getAllProducts() {
//     try {
//       let res = await axios.get("http://localhost:3050/shop");
//       console.log(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   }

  return(
    <div>
    <h1>Welcome to our pottery shop</h1>
    {/* {products.map((product) =>{
        return(
            <div>
                <p>{product.content}</p>
                </div>
        )
    })} */}
    </div>
  )
}

export default Shop;