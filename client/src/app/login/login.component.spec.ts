import { ActivatedRoute, Data } from '@angular/router';
import { Component } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';

/**
 * Load the implementations that should be tested.
 */
import { LoginComponent } from './login.component';

describe('Login', () => {
  /**
   * Provide our implementations or mocks to the dependency injector
   */
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      /**
       * Provide a better mock.
       */
      {
        provide: ActivatedRoute,
        useValue: {
          data: {
            subscribe: (fn: (value: Data) => void) => fn({
              yourData: 'yolo'
            })
          }
        }
      },
      LoginComponent
    ]
  }));

  it('should log ngOnInit', inject([LoginComponent], (login: LoginComponent) => {
    spyOn(console, 'log');
    expect(console.log).not.toHaveBeenCalled();

    login.ngOnInit();
    expect(console.log).toHaveBeenCalled();
  }));

});
