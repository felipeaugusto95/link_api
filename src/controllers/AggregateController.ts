import { Request, Response} from 'express';
import api_bling from '../services/api_bling';
import OrderAggregate from '../models/OrderAggregate';
import moment from 'moment';

require('dotenv/config');

interface IOrder{
    pedido: {
        totalvenda: string;
    }
}

const getOrders = async (req: Request, res: Response, date: Date) => {
    const result = await api_bling.get(`/pedidos/json/&apikey=${process.env.API_KEY_BLING}&filters=dataEmissao[${date} TO ${date}]`);
    const { data } = result;

    if(data.hasOwnProperty('retorno')){
        return data.retorno;
    }
    return null;
}

class AggregateController{

    async index(req: Request, res: Response) {
        try{
            const aggregates = await OrderAggregate.find();
            return res.json(aggregates);
    
        } catch(err){
            return res.status(400).json({error: 'Load users failed'});
        }
    }

    async show(req: Request, res: Response) {
        try{
            const { id } = req.params;
            const aggregate = await OrderAggregate.findById(id);
            if(!aggregate)
                res.status(404).json({error: 'Order not found'});

            return res.json(aggregate);
    
        } catch(err){
            return res.status(400).json({error: 'Load users failed'});
        }
    }

    async create(req: Request, res: Response) {
        const { date } = req.body;
        const formattedDate = moment(date, "DD/MM/YYYY").toDate();
        
        const hasAggreagte = await OrderAggregate.find({ date: formattedDate });
        if(hasAggreagte.length > 0){
            return res.status(400).json({error: 'Order aggregate by date already exists!'});
        } 

        const result = await getOrders(req, res, date);

        var totalValue = 0;
        if(result.hasOwnProperty('pedidos')){
            result.pedidos.forEach((element: IOrder) => {
                totalValue += Number(element.pedido.totalvenda);
            });
        } else{
            return res.status(500).json({error: 'Error when aggregating values'});
        }
        
        const serialized = {
            date: formattedDate,
            totalValue
        }

        await OrderAggregate.create(serialized);

        return res.json(serialized);
    }
}

export default AggregateController;