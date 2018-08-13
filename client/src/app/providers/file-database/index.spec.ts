import { async, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FileDatabase } from './index';

describe('FileDatabase', () => {

  let fileDatabase: FileDatabase;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [ ],
      providers: [ FileDatabase ]
    })
      .compileComponents();
  }));

  beforeEach(inject([FileDatabase], (_fileDatabase: FileDatabase) => {
    fileDatabase = _fileDatabase;
  }));

  it('should create', () => {
    expect(fileDatabase).toBeTruthy();
  });

});
