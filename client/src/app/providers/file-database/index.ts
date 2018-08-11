import { Component, OnInit, Injectable, AfterViewInit, ViewChild } from '@angular/core';

import { MatTree } from '@angular/material';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import { isArray, map } from 'lodash';

/**
 * Json node data with nested structure. Each node has a filename and a value or a list of children
 */
export interface FileNode {
  children?: FileNode[];
  // filename?: string;
  // type?: any;
  key?: string;
}

/** Flat node with expandable and level information */
export class FileFlatNode {
  // filename: string;
  // type: any;
  key: string;
  level: number;
  expandable: boolean;
}


// /**
//  * The Json tree data in string. The data could be parsed into Json object
//  */
// const TREE_DATA = JSON.stringify({
//   Root: {
//     angular: [0, 1, 2, 3, 4, "Lucas"]
//   }
// });


/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  get rootChildren(): FileNode[] {
    return this.data[0].children;
  }

  refresh = () => this.dataChange.next(this.data);

  constructor() {

  }

  pushRootChild(child: FileNode) {
    this.rootChildren.push(child);
    this.refresh();
  }

  refreshData<T>(dataObject: {[key: string]: T}) {
    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested file node as children.
    const data = this.buildFileTree({ Root: dataObject }, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: object, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      // const node: FileNode = { filename: key };
      const node: FileNode = { key };

      if (value != null) {
        if (isArray(value)) {
          node.children = map(value, _key => ({key: _key}));
        } else if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        }
        // else {
        //   node.name = value;
        // }
      }

      return accumulator.concat(node);
    }, []);
  }
}

/**
 * @title Tree with nested nodes
 */
