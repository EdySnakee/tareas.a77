//LOS ELEMENTOS PRINCIPALES EN REACTIVIDAD EN ANGULAR =>
import { Component, Injector, computed, effect, inject, signal } from '@angular/core';

import { Tarea } from 'src/app/models/tareas.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  //ARRAY DE TAREAS
  tareas = signal<Tarea[]>([ ])

  //INSTANCIA PARA CONTROLAR LAS TAREAS
  newTareaCtrl = new FormControl('',{
    nonNullable:true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  });


  // //CONTRUCTOR PARA USAR EFFECT
  // constructor(){
  //   // TRACKING--effect vigila si un estado cambia y permite ejecutar una logica con el caso
  //   effect(()=> {
  //     //vigilamos a tareas
  //     const task = this.tareas();
  //     //crea un representacion en memoria de los cambios / se guardan momentaneamente
  //     localStorage.setItem('task', JSON.stringify(task));
  //                                 //Las conbierte en string
  //   })
  // }
  // -> si effect se usa fuera del contructor se tiene que usar un injector

  injector = inject(Injector)

  constructor() { }


  ngOnInit(): void {
    const storage = localStorage.getItem('task');
    if (storage){
                  //lo convertimos en un objeto
      const tasks = JSON.parse(storage);
      this.tareas.set(tasks);
      //Asignamos lo guardado en el storage a nuestro Array de tareas
    }
    this.trackTareas();
  }


  //Metodo para trackear despues de...
  //GENERAMOS PESISTENCIA DE DATOS USANDO LOCAL STORAGE|
  trackTareas(){
    effect(()=> {
          //vigilamos a tareas
          const task = this.tareas();
          //crea un representacion en memoria de los cambios / se guardan momentaneamente
          localStorage.setItem('task', JSON.stringify(task));
        }, {injector: this.injector});
  }


  // ESTADOS COMPUESTOS CON COMPUTED
  filtro = signal('all');
  tareasFiltro = computed(()=>{
    const filter = this.filtro();
    const tareas = this.tareas();
    if(filter === 'pending'){
      return tareas.filter(t => !t.completed);
    }
    if(filter === 'completed'){
      return tareas.filter(t => t.completed);
    }
    return tareas;
  })



  //Capturando cambio
  changeFiltro(f:string){
    this.filtro.set(f)
  }


  //Capturando el evento para nueva tarea
  changeEvent(){
    //Los form control incluyen estados de validacion
    if (this.newTareaCtrl.valid){
      const value = this.newTareaCtrl.value.trim(); //.trim() limpia los espacios antes y despues de un string
      if(value !== ''){
        this.addTarea(value);
        this.newTareaCtrl.setValue('');
      }
    }
    }

  //agregar una tarea
  addTarea(title: string){
    const newTarea = {
      id: Date.now(),
      title,
      completed:false
    }
    this.tareas.update((tareas)=> [...tareas, newTarea]);
  }

  //EDITANDO TAREA -> entrar en modo edicion
  editTarea(index: number){
    this.tareas.update(prev => {
      return prev.map((tarea, position)=>{
        if (position === index){
          return {
            ...tarea,
            edit:true
          }
        }
        return {
          ...tarea,
          edit:false
        }
      })
    })
  }


  // ACTUALIZANDO EL TEXTO
  actualizaTarea(index: number, event:Event){
    const input = event.target as HTMLInputElement;
    this.tareas.update(prev => {
      return prev.map((tarea, position)=>{
        if (position === index){
          return {
            ...tarea,
            title:input.value,
            edit:false
          }
        }
        return tarea;
      })
    })
  }



  //ACTUALIZAR TAREA
  updateTarea(index: number){
    this.tareas.update((tareas)=>{
      return tareas.map((tareas, position )=>{
        if(position === index){
          return {
            ...tareas,
            completed: !tareas.completed
          }
        }
        return tareas;
      })
    })
  }

  //Eliminar tarea
  deleteTarea(index : number) {
    this.tareas.update((tareas)=> tareas.filter((tareas, position)=> position !== index))
  }

}
