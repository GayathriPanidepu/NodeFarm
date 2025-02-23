const fs=require('fs')
const http=require('http')
const url=require('url')

const replaceTemplate=(template,product)=>{
    let output=template.replace(/{%PRODUCTNAME%}/g,product.productName);
    output=output.replace(/{%IMAGE%}/g,product.image);
    output=output.replace(/{%QUANTITY%}/g,product.quantity);
    output=output.replace(/{%PRICE%}/g,product.price);
    output=output.replace(/{%FROM%}/g,product.from);
    output=output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output=output.replace(/{%DESCRIPTION%}/g,product.description);
    output=output.replace(/{%ID%}/g,product.id);

    if(!product.organic) output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    return output
}
const tempOverview=fs.readFileSync(`${__dirname}/templates/index.html`,'utf-8')
const tempCard=fs.readFileSync(`${__dirname}/templates/template.html`,'utf-8')
const tempProduct=fs.readFileSync(`${__dirname}/templates/details.html`,'utf-8')

const data=fs.readFileSync(`${__dirname}/data-req/data.json`,'utf-8')
const jsonData=JSON.parse(data)

const server=http.createServer((req,res)=>{
    const {query,pathname}=url.parse(req.url,true);
    //OVERVIEW 
    if (pathname==='/' || pathname==='/overview'){

        res.writeHead(200,{'Context-type':'text/html'})
        const cardsHtml=jsonData.map(el=> replaceTemplate(tempCard,el)).join('');
        const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);
    }

    //API 
    else if (pathname==='/api') {
        res.writeHead(200,{'Context-type':'application/json'})
        res.end(data);     
    }

    //PRODUCT
    else if (pathname==='/product'){
        const product=jsonData[query.id]
        const output=replaceTemplate(tempProduct,product)
        res.writeHead(200,{'Context-type':'text/html'})
        res.end(output);
    }

    //NOT FOUND
    else{
    res.end("Hello dudeeee!");
    }
});
server.listen(8000,'127.0.0.1',()=>{
    console.log('Choosthanna anni observe chesthanna');
});
