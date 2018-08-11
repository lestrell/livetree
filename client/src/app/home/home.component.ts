import { FlatTreeControl } from "@angular/cdk/tree";
import { Component, Injectable, ViewChild } from "@angular/core";
import { MatTreeFlatDataSource, MatTreeFlattener, MatTree } from "@angular/material/tree";
import { FileDatabase, FileFlatNode, FileNode } from "../providers/file-database";
import { Observable, of } from "rxjs";
import { DialogSimpleInputComponent } from "@app/dialogs/dialog-simple-input/index.component";
import { MatDialog } from "@angular/material";
import { isEmpty } from "lodash";
/**
 * @title Tree with flat nodes
 */
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  providers: [FileDatabase]
})
export class HomeComponent {
  @ViewChild("tree")
  tree: MatTree<any>;

  treeControl: FlatTreeControl<FileFlatNode>;

  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;

  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;

  constructor(private database: FileDatabase, public dialog: MatDialog) {
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
    });
  }

  openNewFactoryDialog(): void {
    const dialogRef = this.dialog.open(DialogSimpleInputComponent, {
      width: "250px",
      data: { title: "New Factory Name" }
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (!isEmpty(result)) {
        // this.database.data.
        // TODO: push data to server and tree
      }
    });
  }

  ngAfterViewInit() {
    this.tree.treeControl.expandAll();
  }

  transformer = (node: FileNode, level: number) => {
    const flatNode = new FileFlatNode();
    flatNode.filename = node.filename;
    flatNode.type = node.type;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    return flatNode;
  };

  private _getLevel = (node: FileFlatNode) => {
    return node.level;
  };

  private _isExpandable = (node: FileFlatNode) => {
    return node.expandable;
  };

  private _getChildren = (node: FileNode): Observable<FileNode[]> => {
    return of(node.children);
  };

  hasChild = (_: number, _nodeData: FileFlatNode) => {
    return _nodeData.expandable;
  };
}
