<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/9/9 0009
 * Time: 下午 1:16
 */

class privileges {

    private static $tableName = 'privilege';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        Session,
        NormalFacadeImpl,
        Facade {
        NormalFacadeImpl::FillSelf as commonFillSelf;
        DataAccess::IsPrimaryKey as isPrimary;
        DataAccess::specFilter as commonSpecFilter;
        JSON::ToJson as privateToJson;
    }

    private $id = ''; //bigint,
    private $name = ''; //character varying(32),
    private $kind = ''; //character varying(32),
    private $tablen = ''; //character varying(32),
    private $readWrite = '';

    /**
     * @return string
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param string $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getKind()
    {
        return $this->kind;
    }

    /**
     * @param string $kind
     */
    public function setKind($kind)
    {
        $this->kind = $kind;
    }

    /**
     * @return string
     */
    public function getTablen()
    {
        return $this->tablen;
    }

    /**
     * @param string $tablen
     */
    public function setTablen($tablen)
    {
        $this->tablen = $tablen;
    }

    /**
     * @return string
     */
    public function getReadWrite()
    {
        return $this->readWrite;
    }

    /**
     * @param string $readWrite
     */
    public function setReadWrite($readWrite)
    {
        $this->readWrite = $readWrite;
    } //character varying(32),


}
?>