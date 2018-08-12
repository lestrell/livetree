import { FlatTreeControl } from "@angular/cdk/tree";
import { Component, Injectable, AfterViewInit, ViewChild } from "@angular/core";
import { MatTreeFlatDataSource, MatTreeFlattener, MatTree } from "@angular/material/tree";
import { FileDatabase, FileFlatNode, FileNode } from "../providers/file-database";
import { Observable, of } from "rxjs";
import { DialogSimpleInputComponent } from "@app/dialogs/dialog-simple-input/index.component";
import { MatDialog, MatSnackBar } from "@angular/material";
import { isEmpty } from "lodash";
import { DialogRangePickerComponent } from "@app/dialogs/dialog-range-picker/index.component";
import { SocketService } from "@app/providers/socket-service/index.provider";
import { Logger } from '@app/core';
import { IEditFactory } from '../../types/edit-factory';

const logger = new Logger("HomeComponent");
/**
 * @title Tree with flat nodes
 */
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements AfterViewInit {
  @ViewChild("tree")
  tree: MatTree<any>;

  treeControl: FlatTreeControl<FileFlatNode>;

  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;

  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;

  constructor(database: FileDatabase,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private socketService: SocketService) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this._getLevel,
      this._isExpandable,
      this._getChildren
    );
    this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
      this.expandAll();
    });

    this.socketService.initialize();
  }

  expandAll() {
    if (this.tree) {
      this.tree.treeControl.expandAll();
    }
  }

  openNewFactoryDialog(node: any): void {
    console.log(node);
    const dialogRef = this.dialog.open(DialogSimpleInputComponent, {
      width: "250px",
      data: { title: "New Factory Name" }
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (!isEmpty(result)) {
        this.socketService.emit("new_factory", {key: result}, (data: any) => {
          logger.info("callback received", data);
          this.snackBar.open(`${result} added successfully!`, 'Close', { duration: 2000 });
          // this.database.pushRootChild({ key: data });
        });
        // logger.info("data", this.database)
        // this.database.pushRootChild({ name: result });

        this.expandAll();
      }
    });
  }

  editFactoryNodeDialog(node: FileNode): void {
    const { key } = node;

    const dialogRef = this.dialog.open(DialogRangePickerComponent, {
      width: "250px",
      data: { title: `Editing Factory key: ${key}`, key }
    });

    dialogRef.afterClosed().subscribe((result: IEditFactory) => {
      logger.info(result);
      if (!isEmpty(result)) {
        this.socketService.emit("edit_factory", result, () => {
          logger.info("callback received");
        });
        // this.database.data.
        // TODO: push data to server and tree
      }
    });
  }

  ngAfterViewInit() {
    // tslint:disable-next-line:max-line-length
    // ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'aria-expanded: false'. Current value: 'aria-expanded: true'.
    // this.expandAll();
  }

  transformer = (node: FileNode, level: number) => {
    const flatNode = {
      key: node.key,
      level,
      expandable: !!node.children
    };
    return flatNode;
  }

  private _getLevel = (node: FileFlatNode) => {
    return node.level;
  }

  private _isExpandable = (node: FileFlatNode) => {
    return node.expandable;
  }

  private _getChildren = (node: FileNode): Observable<FileNode[]> => {
    return of(node.children);
  }

  hasChild = (_: number, _nodeData: FileFlatNode) => {
    return _nodeData.expandable;
  }
}
