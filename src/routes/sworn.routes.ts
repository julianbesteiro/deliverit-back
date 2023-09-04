import { SwornController } from '@/controllers/sworn.controller';
import SwornModel from '@/models/Sworn';
import SwornRepository from '@/repository/sworn.repository';
import SwornService from '@/services/sworn.service';
import { Router } from 'express';

const router = Router();

const swornRepository = new SwornRepository(SwornModel);
const swornService = new SwornService(swornRepository);
const swornController = new SwornController(swornService);

router.post('/', swornController.createSworn);
router.delete('/:id', swornController.deleteSworn);
