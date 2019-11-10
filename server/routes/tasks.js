const express = require('express');
const router = express.Router();

const withUuid = require('../middlewares/uuid');
const { check, validationResult } = require('express-validator');

function parseBodyErrors(errors) {
  return errors.map((error) => ({
    param: error.param,
    reason: error.msg
  }));
}

module.exports = function(db) {
  router.get('/', async function(req, res) {
    try {
      const result = await db.query('select * from task');
      res.json({
        tasks: result.rows
      });
    } catch (err) {
      res.status(500).json({
        statusCode: 500,
        message: 'internal server error'
      });
    }
  });

  router.get('/:taskId', [withUuid], async function(req, res) {
    const { taskId } = req.params;
    try {
      const result = await db.query('select * from task where id=$1 limit 1', [taskId]);
      if (!result.rowCount) {
        return res.status(404).json({
          statusCode: 404,
          message: 'task not found'
        });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        statusCode: 500,
        message: 'internal server error'
      });
    }
  });

  router.post('/', [
    check('description').isLength({ min: 1 }).withMessage('description is required'),
    check('title').isLength({ min: 1 }).withMessage('title is missing')
  ], async function(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: parseBodyErrors(errors.array()),
        statusCode: 400
      });
    }

    try {
      const { title, description } = req.body;
      const result = await db.query(
        'insert into task(description,title) values($1::text,$2::text) returning *',
        [description, title]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({
        statusCode: 500,
        message: 'internal server error'
      });
    }
  });

  router.put('/:taskId', [
    withUuid,
    check('description').optional().isLength({ min: 1 }),
    check('title').optional().isLength({ min: 1 }),
    check('completed').optional().isBoolean()
  ], async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: parseBodyErrors(errors.array()),
        statusCode: 400
      })
    }
    const { taskId } = req.params;
    try {
      let result = await db.query('select * from task where id=$1 limit 1', [taskId]);
      if (result.rowCount === 0) {
        return res.status(404).json({
          statusCode: 404,
          message: 'task not found'
        });
      }

      const fields = {
        ...result.rows[0],
        ...req.body
      };

      result = await db.query(
        `update task set description=$2::text, title=$3::text, completed=$4 where id=$1 returning *`,
        [taskId, fields.description, fields.title, fields.completed]
      );

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        statusCode: 500,
        message: 'internal server error'
      });
    }
  });

  router.delete('/:taskId', [withUuid], async function(req, res) {
    const { taskId } = req.params;
    try {
      await db.query('delete from task where id=$1', [taskId]);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        statusCode: 500,
        message: 'internal server error'
      });
    }
  });

  return router;
};
