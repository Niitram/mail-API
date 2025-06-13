import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MailService } from './mail.service';

// Renombramos la clase y definimos la ruta base del controlador
@Controller('formularios')
export class MailController {
  // Inyectamos el MailService para poder usar sus métodos
  constructor(private readonly mailService: MailService) {}

  // Definimos la ruta específica y el método HTTP (POST)
  @Post('contacto')
  @HttpCode(HttpStatus.CREATED) // Devuelve un código 201 (Created) en lugar de 200 (OK)
  async recibirDatos(@Body() datosDelFormulario: any) {
    // En lugar de solo imprimir, llamamos al método del servicio
    // que contiene toda la lógica de negocio.
    console.log(
      'Controlador: Datos recibidos del cliente ->',
      datosDelFormulario,
    );

    // El controlador ahora solo se encarga de recibir la petición y delegar el trabajo.
    return this.mailService.procesarYGuardarFormulario(datosDelFormulario);
  }
}
