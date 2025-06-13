import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service'; // Importamos nuestro servicio de Supabase

// Define una interfaz para los datos del formulario.
// Esto ayuda a que TypeScript sepa qué tipo de datos esperamos.
interface FormularioContactoDto {
  nombre: string;
  email: string;
  mensaje: string;
  // Añade aquí cualquier otro campo que tengas en tu formulario
}

@Injectable()
export class MailService {
  // Inyectamos el servicio de Supabase para poder usarlo aquí
  constructor(private readonly supabase: SupabaseService) {}

  // Esta es la función principal que el controlador llamará
  async procesarYGuardarFormulario(datosDelFormulario: FormularioContactoDto) {
    console.log('Servicio: Procesando datos...', datosDelFormulario);

    // ¡IMPORTANTE! Reemplaza 'contactos' con el nombre real de tu tabla en Supabase.
    const tableName = 'contactos';

    try {
      const { data, error } = await this.supabase
        .getClient()
        .from(tableName)
        .insert([
          {
            nombre: datosDelFormulario.nombre,
            email: datosDelFormulario.email,
            mensaje: datosDelFormulario.mensaje,
            // Mapea aquí los otros campos si los tienes
          },
        ])
        .select(); // .select() hace que Supabase devuelva el registro recién creado

      if (error) {
        // Si Supabase devuelve un error, lo lanzamos para que el controlador lo atrape.
        console.error('Error de Supabase:', error.message);
        throw new InternalServerErrorException(
          'No se pudo guardar el registro en la base de datos.',
        );
      }

      console.log('Registro guardado con éxito:', data);

      // En el futuro, aquí podrías llamar a la API de Replicate.
      // Por ejemplo: this.llamarReplicate(data[0].mensaje);

      return {
        message: 'Formulario recibido y guardado con éxito!',
        data: data[0], // Devolvemos el registro que se guardó
      };
    } catch (error) {
      // Atrapamos cualquier otro error que pueda ocurrir
      console.error('Error inesperado en el servicio:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error inesperado al procesar el formulario.',
      );
    }
  }
}
