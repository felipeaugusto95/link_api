import { Request, Response} from 'express';
import api_pipedrive from '../services/api_pipedrive';
import api_bling from '../services/api_bling';
import Deal from '../models/Deal';
import builder from 'xmlbuilder';

require('dotenv/config');

interface IDeal{
    id: number;
    person_id: {
        name: string;
    },
    org_id: {
        name: string;
    }
    title: string;
    value: number;
    products_count: number;
}

interface IProduct{
    id: number;
    name: string;
    quantity: number;
    item_price: number;
}

interface IItems{
    codigo: number;
    descricao: string;
    qtde: number;
    vlr_unit: number;
}

function builderXML(elem: string) {
    let xml = elem.toString();

    return xml.replace('<?xml version="1.0" encoding="utf-8"?>', '');
}

function mountObject(client: string, itens: Array<IItems>, value: number) {
    return {
        pedido: {
        cliente: {
            nome: client
        },
        transporte: {
            volumes: {
                volume: {
                    servico: "SERVICO"
                }
            }
        },
        itens: {
            item: itens,
        },
        parcelas: {
            parcela: {
                valor: value
            }
        }
        }
    };
}

const getDeals = async (req: Request, res: Response) => {
    const result = await api_pipedrive.get(`/deals/?api_token=${process.env.API_TOKEN_PIPEDRIVE}&status=won`);
    const { data } = result;

    if(data.hasOwnProperty('success')){
        return data.data;
    }
    return null;
}

const getProducts = async (req: Request, res: Response, id: number) => {
    let products = await api_pipedrive.get(`/deals/${id}/products?api_token=${process.env.API_TOKEN_PIPEDRIVE}`);
    const { data } = products;

    if(data.hasOwnProperty('success')){
        return data.data;
    }
    return null;
}

const insertOrder = async (req: Request, res: Response, xml: string) => {
    let resp = await api_bling.post(`/pedido/json/&apikey=${process.env.API_KEY_BLING}&xml=${xml}`);
    const { data } = resp;

    if(data.hasOwnProperty('retorno')){
        return data.retorno;
    }
    return null;
}

class IntegrationController{

    async create(req: Request, res: Response) {

        try{
            const returnedDeals = await getDeals(req, res);

            if(returnedDeals !== null){
                returnedDeals.forEach(async function (item: IDeal) {

                    const hasDeal = await Deal.find({ idDeal: item.id });
                    if(hasDeal.length === 0){
                        var arr_itens = new Array;
                        let client = (!item.person_id) ? encodeURIComponent(item.org_id.name) : encodeURIComponent(item.person_id.name);
                        let value = item.value;

                        if(Number(item.products_count) > 0){
                            let productsData = await getProducts(req, res, item.id);
                            if(productsData !== null){
                                productsData.forEach(async function (prod: IProduct) {
                                    arr_itens.push({
                                        codigo: prod.id,
                                        descricao: encodeURIComponent(prod.name),
                                        qtde: prod.quantity,
                                        vlr_unit: prod.item_price
                                    });
                                });
                            }

                        } else{
                            arr_itens.push({
                                codigo: item.id,
                                descricao: encodeURIComponent(item.title),
                                qtde: 1,
                                vlr_unit: item.value
                            });
                        }

                        var generateXML = builder.create(mountObject(client, arr_itens, value), { encoding: 'utf-8' }).end();
                        var xml = builderXML(generateXML.toString());

                        let resp = await insertOrder(req, res, xml);
                        if(resp !== null){
                            if(!resp.hasOwnProperty('pedidos')){
                                return res.status(404).json({
                                    error: true,
                                    message: 'Error in insert order: ' + resp.erros.erro
                                });
                            } else{
                                await Deal.create({idDeal: item.id});
                            }
                        }
                    }
                    
                });
            }  
            else{
                return res.status(404).json({error: 'Error in getDeals'});
            }

            return res.json({
                success: true,
                message: 'Deals launched as a sale successfully!'
            });
            
        } catch (err){
            return res.status(500).json({error: 'Erro inesperado'});
        }
        
    };
}

export default IntegrationController;