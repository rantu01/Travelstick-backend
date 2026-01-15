import { Router } from 'express';
import { FileController } from './file.controller';

const router = Router();

router.post('/single-image-upload', FileController.singleImageUpload);
router.post('/single-pdf-upload', FileController.singlePdfUpload);
router.post('/multiple-image-upload', FileController.multipleImageUpload);
router.delete('/file-remove', FileController.removeImage);

export const fileRouters: Router = router;
