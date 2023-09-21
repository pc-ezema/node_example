app.get('/protected', (req, res, next) => {
    try {
        res.json({ message: 'Protected route' });
    } catch (error) {
        handleCustomError(error, res);
    }
});

app.get('/restricted', (req, res, next) => {
    try {
        // Perform some logic that might result in an unauthorized error
        if (b !== b) {
            throw new UnauthorizedError('Access denied');
        }
        
        // ... your other code ...
        
        res.json({ message: 'Restricted route' });
    } catch (error) {
        handleCustomError(error, res);
    }
});
