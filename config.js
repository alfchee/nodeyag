module.exports = {
    port: 3000,
    sessionSecret : 'bb-login-secret',
    cookieSecret : 'bb-login-secret',
    cookieMaxAge: (1000 * 60 * 60 * 24 * 30),
    uploadPicsDir: '/var/www/html/yag/web/bundles/upload'
};