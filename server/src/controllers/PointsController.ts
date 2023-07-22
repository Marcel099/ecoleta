import { Request, Response } from 'express';      // solução necessária para o TS
import knex from './../database/connection';

class PointsController {
    async index(request: Request, response: Response) {
        // cidade, uf, items (Query Params)
        const { city, uf, items } = request.query

        const parsedItems = String(items)
            .split(',')
            .map( item => Number(item.trim()) )

        const points = await knex('points')     // temidos wheres opcionais
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()     // só vai retornar pontos de coleta distintos
            .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `${process.env.API_URL}/uploads/${point.image}`,
            }
        })
        
        return response.json(serializedPoints)
    }

    async show(request: Request, response: Response) {
        const { id } = request.params

        // se usar first no lugar de select ele não traz mais um array
        const point = await knex('points').where('id', id).first()

        if (!point) {
            return response.status(400).json({message: 'Point not found.'})
        }

        const serializedPoint = {
            ...point,
            image_url: `${process.env.API_URL}/uploads/${point.image}`,
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title')

        return response.json({point: serializedPoint, items})
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        // trx é uma convenção da comunidade para nomear a variável transaction
        const trx = await knex.transaction()
    
        const point = {
            image: request.file?.filename,
            name,
            email,
            whatsapp,
            latitude: Number(latitude),
            longitude: Number(longitude),
            city,
            uf
        }
        
        // Ao realizar um insert o knex traz em um array o id dos registros inseridos
        const insertedIds = await trx('points').insert(point)
    
        const point_id = insertedIds[0]
    
        const pointItems = items
          .split(',')
          .map((item_id: string) => Number(item_id.trim()))
          .map((item_id: number) => {
            return {
                item_id,
                point_id,
            }
        })

        // Isso mesmo. Ele fez vários inserts a partir de um array
        await trx('point_items').insert(pointItems)

        await trx.commit()
        
        return response.json({
            id: point_id,
            ...point
        })
    }
}

export default PointsController;