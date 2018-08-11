import { FlatTreeControl } from "@angular/cdk/tree";
import { Component, Injectable, AfterViewInit, ViewChild } from "@angular/core";
import { MatTreeFlatDataSource, MatTreeFlattener, MatTree } from "@angular/material/tree";
import { FileDatabase, FileFlatNode, FileNode } from "../providers/file-database";
import { Observable, of } from "rxjs";
import { DialogSimpleInputComponent } from "@app/dialogs/dialog-simple-input/index.component";
import { MatDialog } from "@angular/material";
import { isEmpty } from "lodash";
import { DialogRangePickerComponent } from "@app/dialogs/dialog-range-picker/index.component";
import { SocketService } from "@app/providers/socket-service/index.provider";
import { Logger } from '@app/core';

const logger = new Logger("HomeComponent");
/**
 * @title Tree with flat nodes
 */
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  providers: [FileDatabase, SocketService]
})
export class HomeComponent implements AfterViewInit {
  @ViewChild("tree")
  tree: MatTree<any>;

  treeControl: FlatTreeControl<FileFlatNode>;

  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;

  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;

  constructor(private database: FileDatabase, public dialog: MatDialog, private socketService: SocketService) {
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
        // this.database.data.
        // TODO: push data to server and tree
        this.socketService.emit("new_factory", result, (data: any) => {
          logger.info("callback received", data);
          // this.database.pushRootChild({ name: result });
        });
        // logger.info("data", this.database)
        // this.database.pushRootChild({ name: result });

        this.expandAll();
      }
    });
  }

  editFactoryNodeDialog(node: FileNode): void {
    console.log(node);

    const { key } = node;

    const dialogRef = this.dialog.open(DialogRangePickerComponent, {
      width: "250px",
      data: { title: `Editing Factory key: ${key}`, key }
    });

    dialogRef.afterClosed().subscribe((result: { min: number, max: number, numberOfNodes: number}) => {
      console.log(result);
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
    this.expandAll();
  }

  transformer = (node: FileNode, level: number) => {
    const flatNode = new FileFlatNode();
    flatNode.key = node.key;
    // flatNode.type = node.type;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
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
