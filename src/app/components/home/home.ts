import { Component, Inject, OnInit, OnDestroy, inject } from '@angular/core';
import { Chart } from 'chart.js/auto';
import {
  CountBookByCategory,
  BookService,
} from '../../services/book/book-service';
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  bookService = inject(BookService);
  countBooksLoaned: CountBookByCategory[] = [];
  chart!: Chart;
  loading: boolean = false;
  error: string | null = null;

  ngOnInit(): void {
    this.countBooksLoanedByCategory();
  }

  countBooksLoanedByCategory() {
    this.loading = true;
    this.error = null;

    this.bookService.CountBookByCategory().subscribe({
      next: (response: CountBookByCategory[]) => {
        console.log('Count by category:', response);
        this.countBooksLoaned = response;
        this.loading = false;

        // Validar que hay datos antes de crear el gráfico
        if (response && response.length > 0) {
          // Usar setTimeout para asegurar que el DOM esté listo
          setTimeout(() => {
            this.createChart();
          }, 100);
        } else {
          this.error = 'No hay datos disponibles para mostrar';
        }
      },
      error: (error) => {
        console.error('Error fetching book counts by category:', error);
        this.loading = false;
        this.error = 'Error al cargar los datos del gráfico';
      },
    });
  }

  createChart() {
    // Verificar que el elemento canvas existe
    const canvasElement = document.getElementById(
      'grafic'
    ) as HTMLCanvasElement;
    if (!canvasElement) {
      console.error('Canvas element not found');
      this.error = 'Error: No se pudo encontrar el elemento del gráfico';
      return;
    }

    // Destruir gráfico existente si existe
    if (this.chart) {
      this.chart.destroy();
    }

    try {
      // Crear nuevo gráfico con los datos obtenidos
      this.chart = new Chart(canvasElement, {
        type: 'bar',
        data: {
          labels: this.countBooksLoaned.map((row) => row.category),
          datasets: [
            {
              label: 'Cantidad de libros prestados por categoría',
              data: this.countBooksLoaned.map((row) => row.count),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Libros Prestados por Categoría',
            },
            legend: {
              display: true,
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad de libros',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Categorías',
              },
            },
          },
        },
      });

      console.log('Chart created successfully', this.chart);
    } catch (error) {
      console.error('Error creating chart:', error);
      this.error = 'Error al crear el gráfico';
    }
  }

  ngOnDestroy(): void {
    // Limpiar el gráfico cuando el componente se destruya
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
