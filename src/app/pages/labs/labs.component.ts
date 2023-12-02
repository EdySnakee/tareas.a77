import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-labs',
  //al usar 'standalone' retiramos labs.component del import en app.module
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule],
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.css']
})
export class LabsComponent {
  welcome = 'Kiubo'
  nombre = signal('snake')
  contenido = 'Sabrosura'
  componente ='controlador'
  img = 'https://w3schools.com/howto/img_avatar.png'
  disabled = true;

  objeto = signal({
    color : 'white',
    numero : 13,
    img:this.img
  })

  // -> PARA FORMULARIOS USANDO FORM CONTROL
  colorCtrl = new FormControl()
  widthCtrl = new FormControl(50,{
    nonNullable: true,
    validators: [
      Validators.required,
    ]
  })
  nombreCtrl = new FormControl('nombre',{
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
    ]
  })

  //lEER VALOR DESDE LA LOGICA
  constructor(){
    this.colorCtrl.valueChanges.subscribe((valor)=>{
      console.log('valor :>> ', valor);
    })
  }

  // **************************** <-


  // -> MAnejador de evento click
  clickHandler(){
    alert('Holi')
  }


  //change
  changeEvent(event : Event){
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.nombre.set(newValue);
  }
  //key
  keyEvent(event : Event){
    console.log('event :>> ', event);
    const input = event.target as HTMLInputElement;
    console.log(' :>> ', input.value);
  }

  //Signals -> Reactivos
  señal = signal('SEÑAL');



  //DIRECTIVAS DE CONTROL, usando signal se suscribe al cambio en los inputs
  tareas = signal([
    'tar','tareas','tare'
  ])


  //ng SWITCH
  changeNumero(event: Event){
    const input = event.target as HTMLInputElement;
    const newNumero = input.value;
    this.objeto.update(prev => {
      return {
        ...prev,
        numero: parseInt(newNumero)
      }
    })
  }


}
