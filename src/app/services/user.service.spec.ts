import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { Firestore } from '@angular/fire/firestore';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        {
          provide: Firestore,
          useValue: {
            // Simula los métodos que usas de Firestore aquí
            collection: () => ({
              valueChanges: () => ({
                subscribe: () => {}
              }),
              doc: () => ({
                set: () => Promise.resolve(),
                update: () => Promise.resolve(),
                delete: () => Promise.resolve(),
              })
            }),
            doc: () => ({
              valueChanges: () => ({
                subscribe: () => {}
              }),
              set: () => Promise.resolve(),
              update: () => Promise.resolve(),
              delete: () => Promise.resolve(),
            }),
          },
        },
      ],
    });

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
