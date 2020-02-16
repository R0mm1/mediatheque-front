import RowAction from "../../../../../src/assets/ts/list/RowAction";

describe('RowAction', () => {
    it('Correctly handle new confirm message', () => {
        const rowAction = new RowAction('delete', 'Supprimer', 'fa fa-delete');

        expect(rowAction.needConfirm).toBeFalsy();

        const confirmMessage = 'Are you sure?';
        rowAction.setNeedConfirm(true, confirmMessage);
        expect(rowAction.confirmMessage).toBe(confirmMessage);
        expect(rowAction.needConfirm).toBeTruthy();

        expect(() => rowAction.setNeedConfirm(true)).toThrow("No confirmation message provided");
    });
});
