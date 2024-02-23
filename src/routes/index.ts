import { Router } from "express";
import { usuarioRouter } from "./usuario.routes";
import { modeloCaracteristicaRouter } from "./modeloCaracteristica.routes";
import { agenciaRouter } from "./agencia.routes";
import { notificacaoRouter } from "./notificacao.routes";

const router = Router()

router.use('/usuario', usuarioRouter)
router.use('/agencia', agenciaRouter)
router.use('/modelo-caracteristica', modeloCaracteristicaRouter)
router.use('/notificacao', notificacaoRouter)


export { router }